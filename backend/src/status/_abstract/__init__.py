from abc import ABC
from dataclasses import dataclass

import numpy as np
from sklearn.cluster import KMeans

from src.helpers.time import get_past_date, get_past_month_day

from src.helpers.clustering import kmeans_clustering

INTERVAL_DAYS: int = 30

@dataclass
class AbstractStatus( ABC ):

    async def update( self ):
        pass

@dataclass
class AbstractTableStatus( AbstractStatus ):

    last_date: str | None
    recent_entries: list[ dict ] | None
    analysis: dict | None = None

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

@dataclass
class StatusAnalysis( ABC ):

    interval: tuple[ str ] | None = None
    kmeans: dict[ str, list[ dict ] ] | None = None

    def calc_kmeans( self, data: list[ list[ str, int | float ] ], n_clusters=5 ) -> dict[ str, str | list ]:
    
        data = list( data )
        lst = list( map( lambda x: x[ 1 ], data ) ) # ( year, quantity ) or ( year, precipitation_sum ) or ...
        centers, clusters = kmeans_clustering( lst, n_clusters )

        # format result

        clusters = [ { "year": x[0][0], "quantity": int( x[0][1] ), "cluster": x[1] } for x in list( zip( data, clusters ) ) ]        
        self.kmeans = { "centers": centers, "clusters": clusters }
