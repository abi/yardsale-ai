from typing import Any, Dict
from fastapi import APIRouter, Depends

from auth.dependencies import validate_token
from users.types import UserResponseModel
from users.users import get_or_create_user


router = APIRouter()


@router.post("/create")
async def create_user(token: Dict[str, Any] = Depends(validate_token)):
    user = await get_or_create_user(token["sub"])
    return UserResponseModel(**user)
