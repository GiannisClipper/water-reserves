from functools import lru_cache

from pydantic_settings import BaseSettings

class Settings( BaseSettings ):
    db_host: str = ""
    db_port: str = ""
    db_name: str = ""
    db_user: str = ""
    db_password: str = ""

    class Config:
        env_file = ".env"

@lru_cache() # according to @lru_cache() will return a singleton object
def get_settings():
    return Settings()