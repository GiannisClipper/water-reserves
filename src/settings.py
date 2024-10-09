from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings( BaseSettings ):

    cert_file: str = f'{os.getcwd()}/resources/eydap.gr.2025.cert'

    savings_url: str = 'https://www.eydap.gr/el/Controls/GeneralControls/SavingsDetails.aspx'
    production_url: str = 'https://www.eydap.gr/el/Controls/GeneralControls/DrinkingWaterProductionDetails.aspx'
    weather_url: str = 'https://archive-api.open-meteo.com/v1/archive'
    interruptions_url: str = 'https://opendata.eydap.gr'
    nominatim_url: str = 'https://nominatim.openstreetmap.org/search'
    geoapify_url: str = 'https://api.geoapify.com/v1/geocode/search'

    savings_html_path: str = 'resources/db_setup/savings/html'
    production_html_path: str = 'resources/db_setup/production/html'
    weather_json_path: str = 'resources/db_setup/weather/json'
    interruptions_json_path: str = 'resources/db_setup/interruptions/json'

    savings_csv_path: str = 'resources/db_setup/savings'
    production_csv_path: str = 'resources/db_setup/production'
    weather_csv_path: str = 'resources/db_setup/weather'
    interruptions_csv_path: str = 'resources/db_setup/interruptions/csv'

    municipalities_csv_file: str = 'resources/db_setup/interruptions/municipalities.csv'
    municipalities_geojson_file: str = 'resources/geography/dhmoi_okxe_attica.geojson'

    savings_cron: str = "1,21,41 8-21 * * *"
    production_cron: str = "6,26,46 8-21 * * *"
    weather_cron: str = "11,31,51 8-21 * * *"
    interruptions_cron: str = "16,36,56 8-21 * * *"
    geolocation_cron: str = "17,37,57 8-21 * * *"

    db_host: str = ""
    db_port: str = ""
    db_name: str = ""
    db_user: str = ""
    db_password: str = ""

    # Pydantic will read the environment variables in a case-INsensitive way, 
    # an upper-case variable APP_NAME will still be read for the attribute app_name
    GEOAPIFY_API_KEY: str =""

    status: object = None

    model_config = SettingsConfigDict( 
        env_file='resources/.env',
        env_file_encoding='utf-8' 
    )

@lru_cache() # due to @lru_cache, will be returned a singleton object
def get_settings():
    return Settings()