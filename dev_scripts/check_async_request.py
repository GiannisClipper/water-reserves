import asyncio
from src.helpers.request.RequestRunner import AsyncRequestRunner
from src.helpers.request.RequestMethod import AsyncGetRequestMethod, AsyncPostRequestMethod
from src.helpers.request.RequestSettings import InterruptionsPostSettings, InterruptionsGetSettings
from src.helpers.request.RequestResponse import InterruptionsPostRequestResponse, InterruptionsGetRequestResponse

async def main():

    print( 'Check ASYNC requests...' )

    req = AsyncRequestRunner(
        AsyncPostRequestMethod(
            InterruptionsPostSettings( { 'month_year': '02/2024' } )
        ),
        InterruptionsPostRequestResponse()
    )
    print( req.method.settings.params )
    req.set_request_delay( 1 )
    await req.request()
    print( 'error:', req.response.error )
    print( 'data:', req.response.data )

    if req.response.data:
        req = AsyncRequestRunner(
            AsyncGetRequestMethod(
                InterruptionsGetSettings( { 'file_path': req.response.data } )
            ),
            InterruptionsGetRequestResponse()
        )
        print( req.method.settings.params )
        req.set_request_delay( 1 )
        await req.request()
        print( 'error:', req.response.error )
        print( 'data:', req.response.data )


loop = asyncio.new_event_loop()
asyncio.set_event_loop( loop )
loop.run_until_complete( main() )
