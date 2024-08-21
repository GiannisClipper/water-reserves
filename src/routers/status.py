from fastapi import APIRouter, Request
from src.settings import get_settings

router = APIRouter( prefix="/api/v1/status" )

@router.get( "" )
async def get_status( request: Request ):

    return get_settings().status
