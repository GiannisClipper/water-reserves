import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.memory import MemoryJobStore
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from apscheduler.executors.pool import ThreadPoolExecutor, ProcessPoolExecutor
from apscheduler.triggers.cron import CronTrigger

from .savings import savings_cron_job
from .production import production_cron_job
from .weather import weather_cron_job

from src.settings import get_settings
settings = get_settings()

jobstores = { 
    # 'default': MemoryJobStore() 
    'default': SQLAlchemyJobStore( url='sqlite:///apscheduler.sqlite3' )
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

def async_run_savings():
    asyncio.run( savings_cron_job() )

def async_run_production():
    asyncio.run( production_cron_job() )

def async_run_weather():
    asyncio.run( weather_cron_job() )

scheduler.add_job( 
    async_run_savings,
    CronTrigger.from_crontab( settings.savings_cron ), 
    id='1', 
    replace_existing=True 
)

scheduler.add_job( 
    async_run_production,
    CronTrigger.from_crontab( settings.production_cron ), 
    id='2', 
    replace_existing=True 
)

scheduler.add_job( 
    async_run_weather,
    CronTrigger.from_crontab( settings.weather_cron ), 
    id='3', 
    replace_existing=True 
)
