from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings( BaseSettings ):
    
    db_host: str = ""
    db_port: str = ""
    db_name: str = ""
    db_user: str = ""
    db_password: str = ""

    cert_file: str = f'{os.getcwd()}/resources/eydap.gr.cert'

    status: object = None

    model_config = SettingsConfigDict( 
        env_file='resources/.env',
        env_file_encoding='utf-8' 
    )

@lru_cache() # due to @lru_cache, will be returned a singleton object
def get_settings():
    return Settings()