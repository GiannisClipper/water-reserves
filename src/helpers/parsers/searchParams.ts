import type { 
    SearchParamsType, 
    SavingsSearchParamsType 
} from "@/types/searchParams";

import type { 
    FormParamsType, 
    SavingsFormParamsType 
} from "@/types/formParams";

// to convert a `formParams` to `searchParams` object

function searchParamsParser( formParams: FormParamsType ): SearchParamsType {

    const searchParams: SearchParamsType = {};

    searchParams.view_type = formParams.view_type;
    searchParams.chart_type = formParams.chart_type;

    if ( formParams.from_date && formParams.to_date ) {
        searchParams.time_range = `${formParams.from_date},${formParams.to_date}`;
    }

    if ( formParams.from_month_day && formParams.to_month_day ) {
        searchParams.interval_filter = `${formParams.from_month_day},${formParams.to_month_day}`;
    }

    searchParams.time_aggregation = `${formParams.time_aggregation},${formParams.value_aggregation}`;

    if ( formParams.time_aggregation === 'custom_year' ) {
        searchParams.year_start = '10-01';
    }

    return searchParams;
}

// to convert a `savingsFormParams` to `savingsSearchParams` object

function savingsSearchParamsParser( savingsFormParams: SavingsFormParamsType ): SavingsSearchParamsType {

    const formParams: FormParamsType = savingsFormParams;

    const searchParams: SearchParamsType = searchParamsParser( formParams );

    if ( searchParams.time_aggregation ) { 
        if ( searchParams.time_aggregation.startsWith( 'day' ) ) {
            delete searchParams.time_aggregation;
        }
    }

    const reservoir_filter: string = Object.entries( savingsFormParams.reservoir_filter )
        .filter( entry => entry[ 1 ] === true )
        .map( entry => entry[ 0 ] )
        .join( ',' );

    const savingsSearchParams: SavingsSearchParamsType = {
        ...searchParams, 
        reservoir_aggregation: 'sum',
        reservoir_filter,
    }

    return savingsSearchParams;
}

export { 
    searchParamsParser,
    savingsSearchParamsParser,
}