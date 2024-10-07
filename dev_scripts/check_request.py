from src.helpers.Request.interruptions import InterruptionsPostRequest, InterruptionsGetRequest

req = InterruptionsPostRequest( { 'month_year': '09/2024' } )
print( req.params )
req.request()
print( 'error:', req.error )
print( 'data:', req.data )

if req.data:
    req = InterruptionsGetRequest( { 'file_path': req.data } )
    print( req.params )
    req.request()
    print( 'error:', req.error )
    print( 'data:', req.data )