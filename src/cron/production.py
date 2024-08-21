from datetime import datetime

async def production_cron_job():
    print( datetime.now(), "production cron job" )
