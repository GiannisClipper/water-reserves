import asyncio
from src.requests.interruptions import InterruptionsAsyncPostRequestFactory, InterruptionsAsyncGetRequestFactory

async def main():

    print( 'Check ASYNC requests...' )

    req = InterruptionsAsyncPostRequestFactory( { 'month_year': '02/2024' } ).handler
    await req.request()
    print( 'error:', req.response.error )
    print( 'data:', req.response.data )

    if req.response.data:

        req = InterruptionsAsyncGetRequestFactory( { 'file_path': req.response.data } ).handler
        await req.request()
        print( 'error:', req.response.error )
        print( 'data:', req.response.data )


loop = asyncio.new_event_loop()
asyncio.set_event_loop( loop )
loop.run_until_complete( main() )
