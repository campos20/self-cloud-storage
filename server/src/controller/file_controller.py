from fastapi import APIRouter

router = APIRouter(prefix="/file", tags=["File"])


@router.get("/")
async def get_file():
    return [{"username": "Rick"}, {"username": "Morty"}]


@router.post("/")
async def upload_file():
    return [{"username": "Rick"}, {"username": "Morty"}]
