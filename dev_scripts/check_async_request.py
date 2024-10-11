import asyncio
from src.requests.savings import SavingsAsyncGetRequestFactory
from src.requests.production import ProductionAsyncGetRequestFactory
from src.requests.weather import WeatherAsyncGetRequestFactory
from src.requests.interruptions import InterruptionsAsyncPostRequestFactory, InterruptionsAsyncGetRequestFactory
from src.requests.geolocation.nominatim import NominatimAsyncGetRequestFactory
from src.requests.geolocation.geoapify import GeoapifyAsyncGetRequestFactory

from src.queries.locations import LocationsOnceQueryFactory

# async def main():
    # print( 'Check ASYNC savings requests...' )
    # req = SavingsAsyncGetRequestFactory( { 'date': '2024-10-06' } ).handler
    # await req.request()
    # print( 'error:', req.parser.error )
    # print( 'data:', req.parser.data )

# async def main():
#     print( 'Check ASYNC production requests...' )
#     req = ProductionAsyncGetRequestFactory( { 'date': '2024-10-06' } ).handler
#     await req.request()
#     print( 'error:', req.parser.error )
#     print( 'data:', req.parser.data )

async def main():
    print( 'Check ASYNC weather requests...' )
    locations_handler = LocationsOnceQueryFactory().handler
    locations_handler.maker.select_all()
    locations_handler.run_query()
    locations = locations_handler.data
    req = WeatherAsyncGetRequestFactory( { 'date': '2024-10-07', 'locations': locations } ).handler
    await req.request()
    print( 'error:', req.parser.error )
    print( 'data:', req.parser.data )

# async def main():
#     print( 'Check ASYNC interruptions requests...' )
#     req = InterruptionsAsyncPostRequestFactory( { 'month_year': '02/2024' } ).handler
#     await req.request()
#     print( 'error:', req.parser.error )
#     print( 'data:', req.parser.data )

#     if req.parser.data:

#         req = InterruptionsAsyncGetRequestFactory( { 'file_path': req.parser.data } ).handler
#         await req.request()
#         print( 'error:', req.parser.error )
#         print( 'data:', req.parser.data )

# async def main():
#     print( 'Check ASYNC geolocation.nominatim requests...' )
#     req = NominatimAsyncGetRequestFactory( { 'address': 'Αιτωλικού,Πειραιάς,Attica,Greece' } ).handler
#     await req.request()
#     print( 'error:', req.parser.error )
#     print( 'data:', req.parser.data )

# async def main():
#     print( 'Check ASYNC geolocation.geoapify requests...' )
#     req = GeoapifyAsyncGetRequestFactory( { 'address': 'Αιτωλικού,Πειραιάς,Attica,Greece' } ).handler
#     await req.request()
#     print( 'error:', req.parser.error )
#     print( 'data:', req.parser.data )

loop = asyncio.new_event_loop()
asyncio.set_event_loop( loop )
loop.run_until_complete( main() )
