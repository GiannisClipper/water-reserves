from datetime import datetime

async def weather_cron() -> None:
    print( datetime.now(), "weather cron job" )
