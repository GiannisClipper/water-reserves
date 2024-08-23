from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.jobstores.memory import MemoryJobStore
from apscheduler.triggers.cron import CronTrigger

from .savings import savings_cron_job
from .production import production_cron_job
from .weather import weather_cron_job

from src.settings import get_settings
settings = get_settings()

jobstores = { 'default': MemoryJobStore() }

scheduler = AsyncIOScheduler( jobstores=jobstores, timezone='Europe/Athens' ) 

scheduler.add_job( savings_cron_job, CronTrigger.from_crontab( settings.savings_cron ) )

scheduler.add_job( production_cron_job, CronTrigger.from_crontab( settings.production_cron ) )

scheduler.add_job( weather_cron_job, CronTrigger.from_crontab( settings.weather_cron ) )

# scheduler.add_job( weather_cron_job, CronTrigger.from_crontab( "* * * * *" ) )
