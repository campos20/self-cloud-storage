from fastapi import APIRouter
from ..service import user_service

router = APIRouter(prefix="/user", tags=["User"])


@router.get("/")
async def get_my_user():
    return user_service.get_my_user()


@router.post("/")
async def create_user(email: str, password: str):
    return user_service.create_user(email, password)
