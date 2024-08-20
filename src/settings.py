from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
import os

cert_file = f'{os.getcwd()}/resources/eydap.gr.cert'

class Settings( BaseSettings ):
    cert_file: str = cert_file
    db_host: str = ""
    db_port: str = ""
    db_name: str = ""
    db_user: str = ""
    db_password: str = ""

    model_config = SettingsConfigDict( env_file='resources/.env', env_file_encoding='utf-8' )

    # class Config:
    #     env_file = "resources/.env"

@lru_cache() # due to @lru_cache() will return a singleton object
def get_settings():
    return Settings()