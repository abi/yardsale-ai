from fastapi import HTTPException
import httpx
from config import CLERK_BACKEND_URL, CLERK_SECRET_KEY
from db.db import get_db_pool
from users.types import ClerkUser


async def get_user_from_clerk(user_id: str):
    # Make a request to the Clerk API
    headers = {
        "Authorization": f"Bearer {CLERK_SECRET_KEY}",
        "Content-Type": "application/json",
    }
    url = f"{CLERK_BACKEND_URL}/users/{user_id}"

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)

    # Check if the request was successful
    if response.status_code != 200:
        raise HTTPException(
            status_code=400,
            detail="Failed to retrieve user data from Clerk API",
        )

    # Deserialize the response JSON into a User object
    user_data = response.json()

    # TODO: Handle bad responses here and log it
    try:
        user = ClerkUser(**user_data)
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=400,
            detail="Failed to deserialize Clerk user data",
        )

    return user


async def get_or_create_user(clerk_id: str) -> dict[str, str]:
    # Create the user if they don't exist in the DB
    db_pool = get_db_pool()
    async with db_pool.acquire() as conn:
        user = await conn.fetchrow(
            'SELECT * FROM users WHERE "clerk_id" = $1', clerk_id
        )
        if not user:
            user = await get_user_from_clerk(clerk_id)
            # TODO: Handle multiple email addresses
            user_email = user.email_addresses[0].email_address

            # Create the user in the DB
            user = await conn.fetchrow(
                "INSERT INTO users (clerk_id, first_name, last_name, email) VALUES ($1, $2, $3, $4) RETURNING *",
                user.id,
                user.first_name,
                user.last_name,
                user_email,
            )

        else:
            print("User found in DB")

    user = dict(user)
    return user
