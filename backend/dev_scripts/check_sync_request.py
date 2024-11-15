from src.requests._abstract.RequestHandler import SyncRequestHandler
from src.requests._abstract.RequestRunner import SyncGetRequestRunner, SyncPostRequestRunner
from src.requests._abstract.RequestSettings import InterruptionsPostSettings, InterruptionsGetSettings
from src.requests._abstract.ResponseParser import InterruptionsPostResponseParser, InterruptionsGetResponseParser

from src.helpers.csv import parse_csv_rows, parse_csv_columns

def main():
    print( 'Check SYNC requests...' )

    req = SyncRequestHandler(
        SyncPostRequestRunner(
            InterruptionsPostSettings( { 'month_year': '01/2024' } )
        ),
        InterruptionsPostResponseParser()
    )
    # print( req.method.settings.params )
    req.set_request_delay( 1 )
    req.request()
    print( 'error:', req.response.error )
    print( 'data:', req.response.data )

    if req.response.data:
        req = SyncRequestHandler(
            SyncGetRequestRunner(
                InterruptionsGetSettings( { 'file_path': req.response.data } )
            ),
            InterruptionsGetResponseParser()
        )
        # print( req.method.settings.params )
        req.set_request_delay( 1 )
        req.request()
        print( 'error:', req.response.error )
        # print( 'data:', req.response.data )
        content = req.response.data
        rows = parse_csv_rows( content )[ 1: ]
        rows = list( map( lambda row: parse_csv_columns( row ), rows ) )
        print( rows )

main()