from pydantic import BaseModel


class UserCreateRequest(BaseModel):
    email: str
    first_name: str
    last_name: str
    password: str
