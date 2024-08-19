from contextlib import asynccontextmanager
from fastapi import FastAPI

import src.db as db

from src.routers import status as status_router
from src.routers import reservoirs as reservoirs_router
from src.routers import savings as savings_router
from src.routers import factories as factories_router
from src.routers import production as production_router
from src.routers import locations as locations_router
from src.routers import weather as weather_router

from .settings import get_settings
settings = get_settings()

print( "Starting water reserves back-end..." )
if not db.check_db():
    print( "Unable to start water reserves back-end." )
    quit( -1 )

@asynccontextmanager
async def lifespan( app: FastAPI ):
    # Lifespan Events
    # https://fastapi.tiangolo.com/advanced/events/
    print( 'Opening DB pool...' )
    await db.pool.open()
    await db.pool.wait()
    # print( db.pool.get_stats() )
    yield
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
    print( repr( settings ) )
    settings.db_name = 'already printed'
    return { "message": "Water-reserves back-end is up and running..." }

app.include_router( status_router.router )
app.include_router( reservoirs_router.router )
app.include_router( savings_router.router )
app.include_router( factories_router.router )
app.include_router( production_router.router )
app.include_router( locations_router.router )
app.include_router( weather_router.router )
