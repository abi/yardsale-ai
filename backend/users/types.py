from typing import Optional
from pydantic import BaseModel


class ClerkEmailAddress(BaseModel):
    email_address: str


class ClerkUser(BaseModel):
    id: str
    first_name: Optional[str]
    last_name: Optional[str]
    email_addresses: list[ClerkEmailAddress]


# Keep in sync with frontend
class UserResponseModel(BaseModel):
    email: str
    first_name: str | None
    last_name: str | None
    # subscriber_tier: str | None
    stripe_customer_id: str | None
