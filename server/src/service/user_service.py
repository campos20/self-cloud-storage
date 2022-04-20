from ..api import keycloak_api
from ..config.log_config import log


def get_my_user():
    return {'username': 'user', 'email': 'email@example.com'}


def create_user(email: str, password: str):
    log.info(f'Create user {email}')

    response = keycloak_api.create_user(email, password)

    return {'email': email, 'active': True}
