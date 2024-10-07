from src.helpers.request.RequestRunner import SyncRequestRunner
from src.helpers.request.RequestMethod import SyncGetRequestMethod, SyncPostRequestMethod
from src.helpers.request.RequestSettings import InterruptionsPostSettings, InterruptionsGetSettings
from src.helpers.request.RequestResponse import InterruptionsPostRequestResponse, InterruptionsGetRequestResponse

def main():
    print( 'Check SYNC requests...' )

    req = SyncRequestRunner(
        SyncPostRequestMethod(
            InterruptionsPostSettings( { 'month_year': '01/2024' } )
        ),
        InterruptionsPostRequestResponse()
    )
    print( req.method.settings.params )
    req.set_request_delay( 1 )
    req.request()
    print( 'error:', req.response.error )
    print( 'data:', req.response.data )

    if req.response.data:
        req = SyncRequestRunner(
            SyncGetRequestMethod(
                InterruptionsGetSettings( { 'file_path': req.response.data } )
            ),
            InterruptionsGetRequestResponse()
        )
        print( req.method.settings.params )
        req.set_request_delay( 1 )
        req.request()
        print( 'error:', req.response.error )
        print( 'data:', req.response.data )

main()