from fastapi import APIRouter
from typing import Annotated
from dataclasses import dataclass
from pydantic.functional_validators import AfterValidator

from src.validators import validate_time_range, validate_interval_filter, validate_year_start
from src.validators.interruptions import validate_time_aggregation, validate_municipality_filter, validate_municipality_aggregation

from src.queries.interruptions import InterruptionsPoolQueryFactory
from src.queries.municipalities import MunicipalitiesPoolQueryFactory, Municipality
from src.helpers.text import get_query_headers
from src.helpers.clustering import kmeans_clustering

import src.docs as docs
from src.docs.query import timeRangeQuery, intervalFilterQuery, timeΑggregationQuery, yearStartQuery
from src.docs.query import municipalityFilterQuery, municipalityΑggregationQuery

@dataclass
class Legend:
    municipalities: list[ Municipality ] = None

@dataclass
class InterruptionsResponse:
    headers: list[ str ]
    data: list[ tuple ]
    legend: Legend | None = None

router = APIRouter( prefix="/api/v1/interruptions" )

@router.get( "", tags=[ docs.tag_interruptions ] )
async def get_all( 
    time_range: Annotated[ str | None, timeRangeQuery, AfterValidator( validate_time_range ) ] = None, 
    interval_filter: Annotated[ str | None, intervalFilterQuery, AfterValidator( validate_interval_filter ) ] = None, 
    municipality_filter: Annotated[ str | None, municipalityFilterQuery, AfterValidator( validate_municipality_filter ) ] = None, 
    municipality_aggregation: Annotated[ str | None, municipalityΑggregationQuery, AfterValidator( validate_municipality_aggregation ) ] = None, 
    time_aggregation: Annotated[ str | None, timeΑggregationQuery, AfterValidator( validate_time_aggregation ) ] = None,
    year_start: Annotated[ str | None, yearStartQuery, AfterValidator( validate_year_start ) ] = None
) -> InterruptionsResponse:

    query_handler = InterruptionsPoolQueryFactory().handler
    query_handler.maker.select_where(
        time_range, municipality_filter, interval_filter, 
        municipality_aggregation, time_aggregation, year_start
    )
    await query_handler.run_query()

    headers = get_query_headers( query_handler.maker.query )
    data = query_handler.data

    if municipality_aggregation != None:
        return InterruptionsResponse( headers=headers, data=data )

    # calculate interruptions clustering

    if time_aggregation and time_aggregation[ 0 ] == 'alltime':
        # values = list( map( lambda row: .5 * ( row[ -1 ] + row[ -2 ] ), data ) )
        values = list( map( lambda row: ( row[ -1 ], row[ -2 ] ), data ) )
        centers, clusters = kmeans_clustering( values, n_clusters=5 )
        # print( 'centers', centers )
        # print( 'clusters', clusters )
        headers += [ 'n_clusters', 'cluster' ]
        data = [ tuple( list( x[ 0 ] ) + [ len( centers ), x[ 1 ] ] ) for x in zip( data, clusters ) ]

    # place municipalities data in result legend

    query_handler = MunicipalitiesPoolQueryFactory().handler
    query_handler.maker.select_all()
    await query_handler.run_query()
    municipalities = query_handler.data
    legend = Legend( municipalities )
    return InterruptionsResponse( headers=headers, data=data, legend=legend )
