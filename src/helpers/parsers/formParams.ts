import type { 
    SearchParamsType, 
    SavingsSearchParamsType 
} from "@/types/searchParams";

import type { 
    FormParamsType, 
    SavingsFormParamsType 
} from "@/types/formParams";

// to convert a `searchParams` to `formParams` object

function formParamsParser( searchParams: SearchParamsType ): FormParamsType {

    let _: string[] = [ '', '' ];
    if ( searchParams.time_range ) {
        _ = searchParams.time_range.split( ',' );
        if ( _.length === 1 ) {
            _.push( _[ 0 ] );
        }
    }
    const from_date: string = _[ 0 ];
    const to_date: string = _[ 1 ];

    _ = [ '', '' ];
    if ( searchParams.interval_filter ) {
        _ = searchParams.interval_filter.split( ',' );
        if ( _.length === 1 ) {
            _.push( _[ 0 ] );
        }
    }
    const from_month_day: string = _[ 0 ];
    const to_month_day: string = _[ 1 ];

    let time_aggregation: string = 'day';
    if ( searchParams.time_aggregation ) {
        const _: string = searchParams.time_aggregation.split( ',' )[ 0 ];
        time_aggregation = _;
    }

    const formParams: FormParamsType = {
        view_type: searchParams.view_type || 'overall',
        chart_type: searchParams.chart_type || 'line',
        from_date, to_date,
        from_month_day, to_month_day,
        time_aggregation,
    }
    return formParams;
}

// to convert a `savingsSearchParams` to `savingsFormParams` object

function savingsFormParamsParser( savingsSearchParams: SavingsSearchParamsType ): SavingsFormParamsType {

    const searchParams: SearchParamsType = savingsSearchParams;

    const formParams: FormParamsType = formParamsParser( searchParams );

    const reservoir_filter: { [ key: string ]: boolean } = {};
    if ( savingsSearchParams.reservoir_filter ) {
        savingsSearchParams.reservoir_filter
            .split( ',' )
            .forEach( id => reservoir_filter[ id ] = true );
    }

    const savingsFormParams: SavingsFormParamsType = {
        ...formParams, 
        reservoir_filter,
    }

    return savingsFormParams;
}

export { 
    formParamsParser,
    savingsFormParamsParser,
}