from pydantic import BaseSettings


class Settings(BaseSettings):
    keycloak_url: str = ''
    keycloak_user: str = ''
    keycloak_password: str = ''

    class Config:
        env_file = '.env'


settings = Settings()
