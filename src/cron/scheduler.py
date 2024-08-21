from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.jobstores.memory import MemoryJobStore
from apscheduler.triggers.cron import CronTrigger

from .savings import savings_cron_job
from .production import production_cron_job
from .weather import weather_cron_job

jobstores = { 'default': MemoryJobStore() }

scheduler = AsyncIOScheduler( jobstores=jobstores, timezone='Europe/Athens' ) 

scheduler.add_job( weather_cron_job, CronTrigger.from_crontab( "* * * * *" ) )
# scheduler.add_job( savings_cron_job, CronTrigger.from_crontab( "5,25,45 8-21 * * *" ) )
# scheduler.add_job( production_cron_job, CronTrigger.from_crontab( "10,30,50 8-21 * * *" ) )
# scheduler.add_job( weather_cron_job, CronTrigger.from_crontab( "15,35,55 8-21 * * *" ) )
