from contextlib import asynccontextmanager
from fastapi import FastAPI
from datetime import datetime
from pydantic import BaseModel

from .settings import get_settings

import src.db as db
from src.db.tables import exists, tables
from src.db_setup.make_tables import make_tables

import src.docs as docs

print( datetime.now(), "Starting water reserves back-end..." )
print()
print( "+-----------------------+" )
print( "|  1. Data initializer  |" )
print( "+-----------------------+" )
if not exists( tables ):
    try:
        print( "Initializing DB tables..." )
        make_tables( db.tables )

    except Exception as error:
        print( 'Error: ' + repr( error ) )
        print( "Unable to start water reserves back-end." )
        quit( -1 )

from src.status import Status
from src.cron.scheduler import scheduler

@asynccontextmanager
async def lifespan( app: FastAPI ):
    # Lifespan Events
    # https://fastapi.tiangolo.com/advanced/events/

    print( 'Opening DB pool...' )
    await db.pool.open()
    await db.pool.wait()
    # print( db.pool.get_stats() )

    print( 'Loading status...' )
    settings = get_settings()
    settings.status = Status( None, None, None, None, None, None )
    await settings.status.update()

    print()
    print( "+--------------------------+" )
    print( "|  2. Cron jobs scheduler  |" )
    print( "+--------------------------+" )

    # try: 
    #     file = 'apscheduler.sqlite3'
    #     os.remove( file )
    #     print( f"File '{file}' removed.")

    # except FileNotFoundError: 
    #     print( f"File '{file}' not found." )

    print( "Savings cron:", settings.savings_cron )
    print( "Production cron:", settings.production_cron )
    print( "Weather cron:", settings.weather_cron )
    print( "Interruptions cron:", settings.interruptions_cron )
    print( "Geolocation cron:", settings.geolocation_cron )

    # print( 'scheduler.get_jobs()', scheduler.get_jobs() )
    scheduler.print_jobs()
    scheduler.start()
    scheduler.print_jobs()

    print()
    print( "+----------------------+" )
    print( "|  3. REST API server  |" )
    print( "+----------------------+" )

    yield

    print( "Shutting down scheduler..." )
    scheduler.shutdown()

    # print( db.pool.get_stats() )
    print( 'Closing DB pool...' )
    await db.pool.close()

app = FastAPI( 
    lifespan = lifespan,
    title = docs.title,
    version = docs.version,
    description = docs.description,
    openapi_tags = docs.tags_metadata,
    openapi_url = "/api/v1/openapi.json", # by default is served at /openapi.json
    docs_url = "/api/v1/docs", # by default is served at /docs
    redoc_url = "/api/v1/redoc" # by default is served at /redoc
)

# Catch `Exception` globally in FastAPI
# https://stackoverflow.com/a/62407111/12138247
# async def catch_exceptions_middleware( request: Request, call_next ):
#     try:
#         return await call_next( request )
#     except Exception as e:
#         print_exception( e )
#         return JSONResponse( repr( e ), status_code=500 )

# app.middleware( 'http' )( catch_exceptions_middleware )

class HomeResponse( BaseModel ):
    message: str

@app.get( '/', tags=[ docs.tag_home ] )
async def home() -> HomeResponse:
    # for debugging/control purposes
    print( scheduler.print_jobs() )

    return { "message": "Water reserves back-end is up and running..." }

from src.routers import status as status_router
from src.routers import reservoirs as reservoirs_router
from src.routers import savings as savings_router
from src.routers import factories as factories_router
from src.routers import production as production_router
from src.routers import locations as locations_router
from src.routers import weather as weather_router
from src.routers import municipalities as municipalities_router
from src.routers import interruptions as interruptions_router

app.include_router( status_router.router )
app.include_router( reservoirs_router.router )
app.include_router( savings_router.router )
app.include_router( factories_router.router )
app.include_router( production_router.router )
app.include_router( locations_router.router )
app.include_router( weather_router.router )
app.include_router( municipalities_router.router )
app.include_router( interruptions_router.router )

# from src.geography.MunicipalitiesHandler import MunicipalitiesHandler
# print( MunicipalitiesHandler().findCenters() )