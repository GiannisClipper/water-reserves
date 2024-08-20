from datetime import datetime

async def savings_cron() -> None:
    print( datetime.now(), "savings cron job" )
