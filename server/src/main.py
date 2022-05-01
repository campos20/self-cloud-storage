from fastapi import FastAPI

from .controller import user_controller

app = FastAPI()
app.include_router(user_controller.router)
