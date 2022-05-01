from fastapi import APIRouter
from src.request.user_create_request import UserCreateRequest

from ..service import user_service

router = APIRouter(prefix="/user", tags=["User"])


@router.get("/")
async def get_my_user():
    return user_service.get_my_user()


@router.post("/")
async def create_user(user_create_request: UserCreateRequest):
    return user_service.create_user(user_create_request)
