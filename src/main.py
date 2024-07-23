from fastapi import FastAPI

from src.routers import reservoirs as reservoirs_router
from src.routers import factories as factories_router
from src.routers import locations as locations_router

from .settings import get_settings

settings = get_settings()

app = FastAPI()

app.include_router( reservoirs_router.router )
app.include_router( factories_router.router )
app.include_router( locations_router.router )

@app.get( '/', description="This is the home endpoint." )
async def home():
    print( repr( settings ) )
    settings.db_name = 'already printed'
    return { "message": "Water-reserves back-end is up and running..." }