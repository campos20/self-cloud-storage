import logging
import os
import time

import requests
from pydantic import BaseModel
from requests.models import Response

# Keycloak main configuration:  http://localhost:8080/auth/admin/
# User login:                   http://localhost:8080/auth/admin/CloudStorage/console/#/realms/CloudStorage


class User(BaseModel):
    username: str
    password: str
    role: str
    realm_managements: list[str] = []


DEFAULT_REALM = 'CloudStorage'
DEFAULT_CLIENT_ID = 'cloud-storage-api'
KEYCLOAK_HOST = os.environ.get('KEYCLOAK_HOST', 'http://localhost:8080')
MASTER_USER = 'keycloak'
MASTER_PASSWORD = 'keycloak'
WAIT_LIMIT = 20
USERS = [
    User(username='user', password='user', role='user'),
    User(username='operator', password='operator', role='operator'),
    User(username='admin', password='admin',
         role='admin', realm_managements=['view-realm', 'manage-users']),
]

logging.basicConfig(level=logging.INFO)
log = logging.getLogger()

# Global
ACCESS_TOKEN = None


def get_headers():
    return {"Authorization": "Bearer %s" % ACCESS_TOKEN}


def get_master_token():
    log.info("Get master access token")

    url = "%s/auth/realms/master/protocol/openid-connect/token" % KEYCLOAK_HOST
    data = {"grant_type": "password", "username": MASTER_USER,
            "password": MASTER_PASSWORD, "client_id": "admin-cli"}
    response = requests.post(url, data=data)

    status_code = response.status_code
    if status_code != 200:
        raise Exception("Invalid response code: %s" % status_code)

    global ACCESS_TOKEN
    ACCESS_TOKEN = response.json()["access_token"]


def analyze_response(response: Response):
    status_code = response.status_code

    if status_code < 200 or status_code > 299:
        raise Exception("Invalid response code: %s" % status_code)


def analyze_creation_response(response: Response, entity):
    status_code = response.status_code

    if 200 <= status_code <= 299:
        if entity:
            log.info("%s created" % entity)
        else:
            log.info("Success")
    elif status_code == 409:
        log.info("%s already exists" % entity)
    else:
        raise Exception("Invalid response code: %s" % status_code)


def create(url, data, entity=None):
    headers = get_headers()
    response = requests.post(url, json=data, headers=headers)
    analyze_creation_response(response, entity)


def create_realm():
    log.info("Create realm %s" % DEFAULT_REALM)

    url = "%s/auth/admin/realms" % KEYCLOAK_HOST
    data = {"enabled": True, "id": DEFAULT_REALM,
            "realm": DEFAULT_REALM}
    create(url, data, "Realm")


def create_user(user: User):
    log.info("Create user %s" % user.username)

    url = "%s/auth/admin/realms/%s/users" % (KEYCLOAK_HOST, DEFAULT_REALM)
    data = {"enabled": True, "attributes": [],
            "username": user.username, "emailVerified": ""}

    create(url, data, "User")


def create_users():
    for user in USERS:
        create_user(user)


def default_get(url):
    log.info("url = %s" % url)
    headers = get_headers()

    response = requests.get(url, headers=headers)
    analyze_response(response)

    return response.json()


def default_put(url, data):
    headers = get_headers()
    response = requests.put(url, json=data, headers=headers)

    analyze_response(response)


def get_users():
    url = "%s/auth/admin/realms/%s/users" % (
        KEYCLOAK_HOST, DEFAULT_REALM)
    return default_get(url)


def change_password(keycloak_user, user: User):
    username = keycloak_user["username"]
    user_id = keycloak_user["id"]
    log.info("Change password of user %s" % username)

    password = user.password

    url = "%s/auth/admin/realms/%s/users/%s/reset-password" % (
        KEYCLOAK_HOST, DEFAULT_REALM, user_id)
    data = {"type": "password", "value": password, "temporary": False}

    default_put(url, data)


def find_realm_role(realm_roles, management_name: str):
    return next((x for x in realm_roles if x['name'] == management_name), None)['id']


def change_realm_permissions(keycloak_user, user: User, client, realm_roles):
    realm_managements = user.realm_managements
    if len(realm_managements) < 1:
        return
    username = keycloak_user['username']
    log.info(f'Assign realm management for {username}')

    user_id = keycloak_user["id"]
    client_id = client["id"]

    url = f'{KEYCLOAK_HOST}/auth/admin/realms/{DEFAULT_REALM}/users/{user_id}/role-mappings/clients/{client_id}'

    data = list(map(lambda x: {'name': x, 'id': find_realm_role(
        realm_roles, x)}, realm_managements))
    create(url, data)


def get_roles(realm_client):
    client_id = realm_client['id']
    url = f'{KEYCLOAK_HOST}/auth/admin/realms/{DEFAULT_REALM}/clients/{client_id}/roles'
    return default_get(url)


def change_user_details(users, realm_client):
    realm_roles = get_roles(realm_client)
    for keycloak_user in users:
        user = next(
            (x for x in USERS if x.username == keycloak_user["username"]), None)
        change_password(keycloak_user, user)
        change_realm_permissions(
            keycloak_user, user, realm_client, realm_roles)


def create_client():
    log.info("Create client")

    url = "%s/auth/admin/realms/%s/clients" % (KEYCLOAK_HOST, DEFAULT_REALM)
    data = {"enabled": True, "attributes": {}, "redirectUris": [
        "*"], "webOrigins": ["*"], "clientId": DEFAULT_CLIENT_ID, "protocol": "openid-connect"}
    create(url, data, "Client")


def get_clients():
    url = f'{KEYCLOAK_HOST}/auth/admin/realms/{DEFAULT_REALM}/clients?viewableOnly=true'
    return default_get(url)


def user_to_role(user):
    return user.replace("_", "-")


def create_role(url, role):
    log.info("Create role %s" % role)
    data = {"name": role}
    create(url, data, "Role")


def create_roles(client):
    url = "%s/auth/admin/realms/%s/clients/%s/roles" % (
        KEYCLOAK_HOST, DEFAULT_REALM, client["id"])
    for user in list(dict.fromkeys(map(lambda x: x.role, USERS))):
        create_role(url, user_to_role(user))


def assign_role(user, client, role):
    log.info("Assign %s to %s" % (role['name'], user['username']))

    user_id = user["id"]
    client_id = client["id"]
    url = "%s/auth/admin/realms/%s/users/%s/role-mappings/clients/%s" % (
        KEYCLOAK_HOST, DEFAULT_REALM, user_id, client_id)

    data = [{"id": role['id'], "name": role['name'], "composite": False,
             "clientRole": True, "containerId": client_id}]

    create(url, data)


def get_role(roles, username):
    return next(
        (x for x in roles if x["name"] == username), None)


def assign_roles(users, client, roles):
    for user in users:
        role = get_role(roles, user_to_role(user["username"]))
        assign_role(user, client, role)


def get_roles(client):
    client_id = client["id"]
    url = "%s/auth/admin/realms/%s/clients/%s/roles" % (
        KEYCLOAK_HOST, DEFAULT_REALM, client_id)
    return default_get(url)


def change_token_timeout():
    log.info("Change token duration")
    url = "%s/auth/admin/realms/%s" % (KEYCLOAK_HOST, DEFAULT_REALM)

    data = {
        "id": DEFAULT_REALM,
        "realm": DEFAULT_REALM,
        "accessTokenLifespan": 3600,
    }

    default_put(url, data)


def wait_for_start():
    log.info('Waiting for the server to start in {KEYCLOAK_HOST}')
    i = 0
    while True:
        try:
            requests.get(KEYCLOAK_HOST)
            log.info("Keycloak server started")
            return
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as e:
            if i > WAIT_LIMIT:
                raise e
            time.sleep(1)
        i += 1

        log.info("." * i)


def get_client(clients, client_id):
    return next(
        (x for x in clients if x["clientId"] == client_id), None)


def main():

    wait_for_start()

    get_master_token()

    create_realm()

    create_client()
    clients = get_clients()
    api_client = get_client(clients, DEFAULT_CLIENT_ID)
    realm_client = get_client(clients, 'realm-management')

    create_users()
    users = get_users()
    change_user_details(users, realm_client)

    create_roles(api_client)
    roles = get_roles(api_client)
    assign_roles(users, api_client, roles)

    change_token_timeout()


if __name__ == "__main__":
    main()
