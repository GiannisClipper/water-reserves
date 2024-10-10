import asyncio
from src.queries.reservoirs import ReservoirsQueryFactory
from src.queries.factories import FactoriesQueryFactory
from src.queries.locations import LocationsQueryFactory
from src.queries.municipalities import MunicipalitiesQueryFactory
from src.queries.savings import SavingsQueryFactory
from src.queries.production import ProductionQueryFactory
from src.queries.weather import WeatherQueryFactory
from src.queries.interruptions import InterruptionsQueryFactory

import src.db as db

async def main():
    await db.pool.open()
    await db.pool.wait()

    # print( 'Check reservoirs queries...' )
    # handler = ReservoirsQueryFactory().handler

    # print( 'Check factories queries...' )
    # handler = FactoriesQueryFactory().handler

    # print( 'Check locations queries...' )
    # handler = LocationsQueryFactory().handler

    # print( 'Check municipalities queries...' )
    # handler = MunicipalitiesQueryFactory().handler

    # handler.maker.select_all()
    # await handler.run_query()
    # print( 'error:', handler.error )
    # print( 'data:', handler.data )

    # handler.maker.select_by_id( 3 )
    # await handler.run_query()
    # print( 'error:', handler.error )
    # print( 'data:', handler.data )

    # handler.maker.select_by_id( '9216' )
    # await handler.run_query()
    # print( 'error:', handler.error )
    # print( 'data:', handler.data )

    # print( 'Check savings queries...' )
    # handler = SavingsQueryFactory().handler

    # print( 'Check production queries...' )
    # handler = ProductionQueryFactory().handler

    # print( 'Check weather queries...' )
    # handler = WeatherQueryFactory().handler

    print( 'Check interruptions queries...' )
    handler = InterruptionsQueryFactory().handler

    handler.maker.select_by_id( 100 )
    await handler.run_query()
    print( 'error:', handler.error )
    print( 'data:', handler.data )

    await db.pool.close()

loop = asyncio.new_event_loop()
asyncio.set_event_loop( loop )
loop.run_until_complete( main() )