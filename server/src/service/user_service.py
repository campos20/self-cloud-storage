from ..api import keycloak_api


def get_my_user():
    return {'username': 'user', 'email': 'email@example.com'}


def create_user(email: str, password: str):
    keycloak_api.login()

    return {'email': email, 'active': True}
