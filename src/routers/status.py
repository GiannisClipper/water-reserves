from fastapi import APIRouter, Request

router = APIRouter( prefix="/api/v1/status" )

@router.get( "" )
async def get_status( request: Request ):

    return request.app.status