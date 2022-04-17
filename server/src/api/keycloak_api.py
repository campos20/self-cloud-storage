from ..config.application_config import settings


def login():
    password = settings.keycloak_password
    print(f'password {password}')
