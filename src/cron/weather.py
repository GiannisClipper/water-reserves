from datetime import datetime

async def weather_cron_job() -> None:
    print( datetime.now(), "weather cron job" )
