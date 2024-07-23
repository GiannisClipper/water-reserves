from contextlib import asynccontextmanager
from fastapi import FastAPI

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

app.include_router( reservoirs_router.router )
app.include_router( savings_router.router )
app.include_router( factories_router.router )
app.include_router( locations_router.router )

@app.get( '/', description="This is the home endpoint." )
async def home():
    print( repr( settings ) )
    settings.db_name = 'already printed'
    return { "message": "Water-reserves back-end is up and running..." }