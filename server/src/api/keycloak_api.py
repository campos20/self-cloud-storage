from datetime import datetime, timedelta

import requests

from ..config.application_config import settings
from ..config.log_config import log

cached_token = ''
cached_expiration = datetime.now()


def login():
    password = settings.keycloak_password
    url = f'{settings.keycloak_url}/auth/realms/{settings.realm_name}/protocol/openid-connect/auth'
    print(f'password {password}')


def cache_token():
    log.info('Get token')
    url = f'{settings.keycloak_url}/auth/realms/{settings.keycloak_realm}/protocol/openid-connect/token'

    log.info(f'url = {url}')

    data = {"grant_type": "password", "username": settings.keycloak_user,
            "password": settings.keycloak_password, "client_id": settings.keycloak_client_id}
    response = requests.post(url, data=data)

    status_code = response.status_code
    if status_code != 200:
        raise Exception("Invalid response code: %s" % status_code)

    response_json = response.json()

    global cached_token
    global cached_expiration

    cached_token = response_json["access_token"]
    cached_expiration = datetime.now(
    ) + timedelta(seconds=response_json["expires_in"])


def get_cached_token():
    global cached_token, cached_expiration

    if not cached_token or datetime.now() - timedelta(seconds=15) > cached_expiration:
        cache_token()
    return cached_token


def create_user(email: str, password: str):
    token = get_cached_token()
    print(token)
