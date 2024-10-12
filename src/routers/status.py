from fastapi import APIRouter, Request
from src.settings import get_settings

import src.docs as docs

router = APIRouter( prefix="/api/v1/status" )

@router.get( "", tags=[ docs.tag_status ] )
async def get_status( request: Request ):

    return get_settings().status
