import type { SearchParamsType } from "@/types/searchParams";
import type { QueryParamsType, SavingsQueryParamsType } from "@/types/queryParams";

const parseQueryParams = ( searchParams: SearchParamsType ): QueryParamsType => {

    const { from_date, to_date, from_day, to_day, time_aggregation }: SearchParamsType = searchParams;

    const queryParams: QueryParamsType = {};

    if ( from_date && to_date ) queryParams.time_range = `${from_date},${to_date}`;
    if ( from_day && to_day ) queryParams.interval_filter = `${from_day},${to_day}`;
    if ( time_aggregation ) queryParams.time_aggregation = `${time_aggregation},avg`;
    if ( time_aggregation && time_aggregation == 'custom_year' ) queryParams.year_start = '10-01';

    return queryParams;
}

const parseSavingsQueryParams = ( searchParams: SearchParamsType ): SavingsQueryParamsType => {

    const { from_date, to_date, from_day, to_day, time_aggregation }: SearchParamsType = searchParams;

    const savingsQueryParams: SavingsQueryParamsType = {
        ...parseQueryParams( { from_date, to_date, from_day, to_day, time_aggregation } ),
        reservoir_aggregation: 'sum'
    };


    return savingsQueryParams;
}

export { parseSavingsQueryParams };
