from fastapi import FastAPI

from .controller import file_controller, user_controller

app = FastAPI()
app.include_router(file_controller.router)
app.include_router(user_controller.router)
