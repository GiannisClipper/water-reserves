from contextlib import asynccontextmanager
from fastapi import FastAPI
from datetime import datetime

import src.db as db
from src.db_setup.make_tables import make_tables
from .settings import get_settings

print( "Starting water reserves back-end..." )
if not db.tables_exists( db.tables ):
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

    print( 'Setting status...' )
    settings = get_settings()
    settings.status = Status( None, None, None )
    await settings.status.update()

    print( datetime.now(), "Starting scheduler..." )
    scheduler.start()

    yield

    print( datetime.now(), "Shutting down scheduler..." )
    scheduler.shutdown()

    # print( db.pool.get_stats() )
    print( 'Closing DB pool...' )
    await db.pool.close()

app = FastAPI( lifespan=lifespan )

# Catch `Exception` globally in FastAPI
# https://stackoverflow.com/a/62407111/12138247
# async def catch_exceptions_middleware( request: Request, call_next ):
#     try:
#         return await call_next( request )
#     except Exception as e:
#         print_exception( e )
#         return JSONResponse( repr( e ), status_code=500 )

# app.middleware( 'http' )( catch_exceptions_middleware )

@app.get( '/', description="This is the home endpoint." )
async def home():
    return { "message": "Water-reserves back-end is up and running..." }

from src.routers import status as status_router
from src.routers import reservoirs as reservoirs_router
from src.routers import savings as savings_router
from src.routers import factories as factories_router
from src.routers import production as production_router
from src.routers import locations as locations_router
from src.routers import weather as weather_router

app.include_router( status_router.router )
app.include_router( reservoirs_router.router )
app.include_router( savings_router.router )
app.include_router( factories_router.router )
app.include_router( production_router.router )
app.include_router( locations_router.router )
app.include_router( weather_router.router )
