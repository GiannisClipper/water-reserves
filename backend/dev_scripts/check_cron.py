import asyncio
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.memory import MemoryJobStore
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from apscheduler.triggers.cron import CronTrigger

jobstores = { 
    'default': MemoryJobStore() 
    # 'default': SQLAlchemyJobStore( url='sqlite:///apscheduler.sqlite3' )
}

scheduler = BackgroundScheduler( 
    jobstores=jobstores, 
    timezone='Europe/Athens',
    job_defaults={ 
        'misfire_grace_time': 60
        # misfire_grace_time (int) – the time (in seconds) how much this job’s execution is allowed to be late 
        # (None means “allow the job to run no matter how late it is”)
    }
) 

async def counting_cron_job() -> None:
    print( 'counting_cron_job()' )
    counter =  0
    while True:
        await asyncio.sleep( 5 )
        print( counter )
        counter += 1

def async_run_counting():
    asyncio.run( counting_cron_job() )

scheduler.add_job( 
    async_run_counting,
    CronTrigger.from_crontab( '48,49,50 8-21 * * *' ), 
    id='99', 
    replace_existing=True 
)

print( 'scheduler.start()' )
scheduler.start()
print( 'Press any key to stop...' )
input()


