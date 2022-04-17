from fastapi import APIRouter

router = APIRouter(prefix="/user", tags=["User"])


@router.get("/")
async def get_my_user():
    return [{"username": "Rick"}, {"username": "Morty"}]


@router.post("/")
async def create_user():
    return [{"username": "Rick"}, {"username": "Morty"}]
