import asyncio
from src.helpers.Request.interruptions import InterruptionsPostRequest, InterruptionsGetRequest

async def main():
    req = InterruptionsPostRequest( { 'month_year': '05/2024' } )
    print( req.params )
    await req.request()
    print( 'error:', req.error )
    print( 'data:', req.data )

    if req.data:
        req = InterruptionsGetRequest( { 'file_path': req.data } )
        print( req.params )
        await req.request()
        print( 'error:', req.error )
        print( 'data:', req.data )

loop = asyncio.new_event_loop()
asyncio.set_event_loop( loop )
loop.run_until_complete( main() )
