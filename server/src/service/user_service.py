from src.request.user_create_request import UserCreateRequest

from ..api import keycloak_api
from ..config.log_config import log


def get_my_user():
    return {'username': 'user', 'email': 'email@example.com'}


def create_user(user_create_request: UserCreateRequest):
    log.info(f'Create user {user_create_request.email}')

    response = keycloak_api.create_user(user_create_request)

    return {'email': user_create_request.email, 'active': True}
