from src.db import savings, production, weather
from src.db import reservoirs, factories, locations
from src.helpers.time import get_past_date, get_past_month_day

from abc import ABC
from dataclasses import dataclass

import numpy as np
from sklearn.cluster import KMeans

INTERVAL_DAYS: int = 30

@dataclass
class AbstractStatus( ABC ):
    async def update( self ):
        pass


@dataclass
class AbstractTableStatus( AbstractStatus ):
    last_date: str | None
    recent_entries: list[ list ] | None
    kmeans: dict[ str, list[ dict ] ] | None

    def get_time_range( self ) -> tuple:
        from_date: str = get_past_date( self.last_date, INTERVAL_DAYS - 1 )
        to_date: str = self.last_date
        return ( from_date, to_date )

    def format_entries( self, headers: list[ str ], data: list[ list ] ) -> list[ dict ]:
        return [ { z[0]: z[1] for z in zip( headers, row ) } for row in data ]
    
    def get_interval( self ) -> tuple[ str ]:
        year, month, day = self.last_date.split( '-' )
        to_interval = f'{month}-{day}'
        from_interval = get_past_month_day( to_interval, INTERVAL_DAYS - 1 )
        return ( from_interval ,to_interval )
    
    def get_year_start( self ) -> str | None:
        from_interval ,to_interval = self.get_interval()
        return from_interval if from_interval > to_interval else None

    async def calc_kmeans( self, data: list[ list[ str, int | float ] ] ) -> dict[ str, str | list ]:
    
        lst = list( map( lambda x: x[ 1 ], data ) ) # ( year, quantity )
        arr = np.array( lst )
        # print( lst, arr )

        kmeans = KMeans( n_clusters=5, max_iter=600, random_state=32 )
        kmeans.fit( arr.reshape( -1, 1 ) )
        # print( kmeans.cluster_centers )
        # print( kmeans.labels_ )

        centers = list( map( lambda x: x[ 0 ], kmeans.cluster_centers_ ) )
        centers = list( map( lambda x: int( x ), centers ) )

        clusters = kmeans.predict( arr.reshape( -1, 1 ) )
        clusters = list( map( lambda x: int( x ), clusters ) )
        # print( centers )
        # print( clusters )

        # change cluster to center values, sort centers, change back to cluster values

        clusters = list( map( lambda cl: centers[ cl ], clusters ) )
        centers.sort()
        clusters = list( map( lambda cl: centers.index( cl ), clusters ) )
        # print( centers )
        # print( clusters )

        # format result

        interval = self.get_interval()
        clusters = [ { "year": x[0][0], "qunatity": int( x[0][1] ), "cluster": x[1] } for x in list( zip( data, clusters ) ) ]
        return { "interval": interval, "centers": centers, "clusters": clusters }


@dataclass
class SavingsStatus( AbstractTableStatus ):

    reservoirs: list[ object ] | None

    async def update( self ) -> None:
        self.last_date = await savings.select_last_date()
        
        headers, data = await savings.select_all( 
            time_range=self.get_time_range(),
            reservoir_aggregation='sum'
        )
        self.recent_entries = self.format_entries( headers, data )

        self.reservoirs = await reservoirs.select_all()

        # kmeans calculation

        interval = self.get_interval()
        year_start = self.get_year_start()
        headers, data = await savings.select_all( 
            interval_filter=interval,
            reservoir_aggregation='sum', 
            time_aggregation=( 'year', 'avg' ),
            year_start=year_start
        )
        self.kmeans = await self.calc_kmeans( data )


@dataclass
class ProductionStatus( AbstractTableStatus ):

    factories: list[ object ]

    async def update( self ):
        self.last_date = await production.select_last_date()

        headers, data = await production.select_all( 
            time_range=self.get_time_range(),
            factory_aggregation='sum'
        )
        self.recent_entries = self.format_entries( headers, data )

        self.factories = await factories.select_all()

        # kmeans calculation

        interval = self.get_interval()
        year_start = self.get_year_start()
        headers, data = await production.select_all( 
            interval_filter=interval,
            factory_aggregation='sum', 
            time_aggregation=( 'year', 'avg' ),
            year_start=year_start
        )
        self.kmeans = await self.calc_kmeans( data )


@dataclass
class WeatherStatus( AbstractTableStatus ):

    locations: list[ object ]

    async def update( self ):
        self.last_date = await weather.select_last_date()

        headers, data = await weather.select_all( 
            time_range=self.get_time_range(),
            location_aggregation='sum'
        )
        self.recent_entries = self.format_entries( headers, data )

        self.locations = await locations.select_all()

        # kmeans calculation

        interval = self.get_interval()
        year_start = self.get_year_start()
        headers, data = await weather.select_all( 
            interval_filter=interval,
            location_aggregation='sum', 
            time_aggregation=( 'year', 'sum' ),
            year_start=year_start
        )
        self.kmeans = await self.calc_kmeans( data )


@dataclass
class Status( AbstractStatus ):

    savings: SavingsStatus | None
    production: ProductionStatus | None
    weather: WeatherStatus | None

    async def update( self ):

        self.savings = SavingsStatus( None, None, None, None )
        await self.savings.update()

        self.production = ProductionStatus( None, None, None, None )
        await self.production.update()

        self.weather = WeatherStatus( None, None, None, None )
        await self.weather.update()
