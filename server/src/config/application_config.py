from pydantic import BaseSettings


class Settings(BaseSettings):
    app_name: str = ''
    keycloak_url: str = ''
    keycloak_user: str = ''
    keycloak_password: str = ''
    keycloak_realm: str = ''
    keycloak_client_id: str = ''

    class Config:
        env_file = '.env'


settings = Settings()
