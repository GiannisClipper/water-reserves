from datetime import datetime

async def production_cron():
    print( datetime.now(), "production cron job" )
