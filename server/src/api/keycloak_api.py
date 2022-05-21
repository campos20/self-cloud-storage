from datetime import datetime, timedelta

import requests
from fastapi import HTTPException
from src.request.user_create_request import UserCreateRequest

from ..config.application_config import settings
from ..config.log_config import log

cached_token = ''
cached_expiration = datetime.now()


def _cache_token():
    global cached_token, cached_expiration

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

    cached_token = response_json["access_token"]
    cached_expiration = datetime.now(
    ) + timedelta(seconds=response_json["expires_in"])


def _get_cached_token():
    global cached_token, cached_expiration

    if not cached_token or datetime.now() - timedelta(seconds=15) > cached_expiration:
        _cache_token()
    return cached_token


def _get_headers():
    token = _get_cached_token()
    return {'Authorization': f'Bearer {token}'}


def create_user(user: UserCreateRequest):
    url = f'{settings.keycloak_url}/auth/admin/realms/{settings.keycloak_realm}/users'
    log.info(f'url = {url}')

    json = {
        "enabled": True,
        "attributes": {},
        "groups": [],
        "username": user.email,
        "emailVerified": "",
        "email": user.email,
        "firstName": user.first_name,
        "lastName": user.last_name,

        "credentials": [{"type": "password", "value": user.password, "temporary": False}]
    }

    headers = _get_headers()

    response = requests.post(url, json=json, headers=headers)

    if not response.ok:
        raise HTTPException(status_code=response.status_code,
                            detail=response.json()['errorMessage'])
