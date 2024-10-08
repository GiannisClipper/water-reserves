import asyncio
from src.requests.interruptions import InterruptionsAsyncPostRequestFactory, InterruptionsAsyncGetRequestFactory
from src.requests.savings import SavingsAsyncGetRequestFactory
from src.requests.production import ProductionAsyncGetRequestFactory
from src.requests.weather import WeatherAsyncGetRequestFactory

import psycopg
import src.db as db
from src.db import locations

# async def main():
#     print( 'Check ASYNC savings requests...' )
#     req = SavingsAsyncGetRequestFactory( { 'date': '2024-10-06' } ).handler
#     await req.request()
#     print( 'error:', req.response.error )
#     print( 'data:', req.response.data )

# async def main():
#     print( 'Check ASYNC production requests...' )
#     req = ProductionAsyncGetRequestFactory( { 'date': '2024-10-06' } ).handler
#     await req.request()
#     print( 'error:', req.response.error )
#     print( 'data:', req.response.data )

async def main():
    print( 'Check ASYNC weather requests...' )
    await db.pool.open()
    await db.pool.wait()
    loc = await locations.select_all()
    await db.pool.close()
    req = WeatherAsyncGetRequestFactory( { 'date': '2024-10-07', 'locations': loc } ).handler
    await req.request()
    print( 'error:', req.response.error )
    print( 'data:', req.response.data )

# async def main():
#     print( 'Check ASYNC interruptions requests...' )
#     req = InterruptionsAsyncPostRequestFactory( { 'month_year': '02/2024' } ).handler
#     await req.request()
#     print( 'error:', req.response.error )
#     print( 'data:', req.response.data )

#     if req.response.data:

#         req = InterruptionsAsyncGetRequestFactory( { 'file_path': req.response.data } ).handler
#         await req.request()
#         print( 'error:', req.response.error )
#         print( 'data:', req.response.data )


loop = asyncio.new_event_loop()
asyncio.set_event_loop( loop )
loop.run_until_complete( main() )
