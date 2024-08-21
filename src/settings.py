from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic.dataclasses import dataclass
import os

cert_file = f'{os.getcwd()}/resources/eydap.gr.cert'

@dataclass
class TableStatus:
    last_date: str
    last_entries: list[ list ]

@dataclass
class SavingsStatus( TableStatus ):
    reservoirs: list[ object ]

@dataclass
class ProductionStatus( TableStatus ):
    factories: list[ object ]

@dataclass
class WeatherStatus( TableStatus ):
    locations: list[ object ]

@dataclass
class Status:
    savings: SavingsStatus
    production: ProductionStatus
    weather: WeatherStatus

class Settings( BaseSettings ):
    cert_file: str = cert_file
    db_host: str = ""
    db_port: str = ""
    db_name: str = ""
    db_user: str = ""
    db_password: str = ""
    status: Status | None = None

    model_config = SettingsConfigDict( env_file='resources/.env', env_file_encoding='utf-8' )

    # class Config:
    #     env_file = "resources/.env"

@lru_cache() # due to @lru_cache() will return a singleton object
def get_settings():
    return Settings()