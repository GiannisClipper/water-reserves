from contextlib import asynccontextmanager
from fastapi import FastAPI
# from starlette.requests import Request
# from starlette.responses import JSONResponse
# from traceback import print_exception

import src.db as db

from src.routers import reservoirs as reservoirs_router
from src.routers import savings as savings_router
from src.routers import factories as factories_router
from src.routers import locations as locations_router

from .settings import get_settings

settings = get_settings()

@asynccontextmanager
async def lifespan( app: FastAPI ):
    # Lifespan Events
    # https://fastapi.tiangolo.com/advanced/events/
    await db.open_pool()
    yield
    await db.close_pool()

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

app.include_router( reservoirs_router.router )
app.include_router( savings_router.router )
app.include_router( factories_router.router )
app.include_router( locations_router.router )

@app.get( '/', description="This is the home endpoint." )
async def home():
    print( repr( settings ) )
    settings.db_name = 'already printed'
    return { "message": "Water-reserves back-end is up and running..." }