import type { 
    SearchParamsType, 
    SavingsSearchParamsType 
} from "@/types/searchParams";

import type {
    ViewType, ChartType,
    FormParamsType, 
    SavingsFormParamsType 
} from "@/types/formParams";


class FormParams {

    _viewType: ViewType = 'overall';
    _chartType: ChartType = 'line';

    _fromDate: string = '';
    _toDate: string = '';

    _fromInterval: string = '';
    _toInterval: string = '';

    _timeAggregation: string = 'day';
    _valueAggregation: string = 'avg';

    constructor( searchParams: SearchParamsType ) {

        this.viewType = searchParams.view_type;
        this.chartType = searchParams.chart_type;

        this.convertTimeRange( searchParams.time_range );
        this.convertIntervalFilter( searchParams.interval_filter );

        this.timeAggregation = searchParams.time_aggregation;
        this.valueAggregation = searchParams.value_aggregation;
    }

    set viewType( val: ViewType | undefined ) {
        this._viewType = val ? val : this._viewType;
    }

    set chartType( val: ChartType | undefined ) {
        this._chartType = val ? val : this._chartType;
    }

    set fromDate( val: string | undefined ) {
        this._fromDate = val ? val : this._fromDate;
    }

    set toDate( val: string | undefined ) {
        this._toDate = val ? val : this._toDate;
    }

    set fromInterval( val: string | undefined ) {
        this._fromInterval = val ? val : this._fromInterval;
    }

    set toInterval( val: string | undefined ) {
        this._toInterval = val ? val : this._toInterval;
    }

    set timeAggregation( val: string | undefined ) {
        this._timeAggregation = val ? val : this._timeAggregation;
    }

    set valueAggregation( val: string | undefined ) {
        this._valueAggregation = val ? val : this._valueAggregation;
    }

    convertTimeRange( val: string | undefined ) {

        if ( val ) {
            const _ = val.split( ',' );
            if ( _.length === 1 ) 
                _.push( _[ 0 ] );

            this.fromDate = _[ 0 ];
            this.toDate = _[ 1 ];
        }
    }

    convertIntervalFilter( val: string | undefined ) {

        if ( val ) {
            const _ = val.split( ',' );
            if ( _.length === 1 ) 
                _.push( _[ 0 ] );

            this.fromInterval = _[ 0 ];
            this.toInterval = _[ 1 ];
        }
    }

    setFromObject( formParams: FormParamsType ): FormParams {

        this._viewType = formParams.viewType;
        this._chartType = formParams.chartType;
    
        this._fromDate = formParams.fromDate;
        this._toDate = formParams.toDate;
    
        this._fromInterval = formParams.fromInterval;
        this._toInterval = formParams.toInterval;
    
        this._timeAggregation = formParams.timeAggregation;
        this._valueAggregation = formParams.valueAggregation;   
        
        return this;
    }

    getAsObject(): FormParamsType {
        return { 
            viewType: this._viewType,
            chartType: this._chartType,

            fromDate: this._fromDate,
            toDate: this._toDate,

            fromInterval: this._fromInterval,
            toInterval: this._toInterval,

            timeAggregation: this._timeAggregation,
            valueAggregation: this._valueAggregation,
        };  
    }

    getAsSearchObject(): SearchParamsType {

        const searchParams: SearchParamsType = {};

        searchParams.view_type = this._viewType;
        searchParams.chart_type = this._chartType;
    
        if ( this._fromDate && this._toDate ) {
            searchParams.time_range = `${this._fromDate},${this._toDate}`;
        }
    
        if ( this._fromInterval && this._toInterval ) {
            searchParams.interval_filter = `${this._fromInterval},${this._toInterval}`;
        }
    
        searchParams.time_aggregation = `${this._timeAggregation},${this._valueAggregation}`;
    
        if ( this._timeAggregation === 'custom_year' ) {
            searchParams.year_start = '10-01';
        }
    
        return searchParams;
    }
}

class SavingsFormParams extends FormParams {

    _reservoirAggregation: string = 'sum';
    _reservoirFilter: { [ key: string ]: boolean } = {};
    _reservoirs: { [ key: string ]: any }[] = [];

    constructor( savingsSearchParams: SavingsSearchParamsType, reservoirs: { [ key: string ]: any }[] ) {
        const searchParams: SearchParamsType = savingsSearchParams;
        super( searchParams );

        this._reservoirs = reservoirs;
        this.reservoirAggregation = savingsSearchParams.reservoir_aggregation;
        this.convertReservoirFilter( savingsSearchParams.reservoir_filter );
    }

    set reservoirAggregation( val: string | undefined ) {
        this._reservoirAggregation = val ? val : this._reservoirAggregation;
    }

    // set reservoirFilter( val: { [ key: string ]: boolean } | undefined ) {
    //     this._reservoirFilter = val ? val : this._reservoirFilter;
    // }

    convertReservoirFilter( val: string | undefined ) {

        if ( val ) {
            this._reservoirs.forEach( r => this._reservoirFilter[ r.id ] = false );
            const ids = val.split( ',' );
            ids.forEach( id => this._reservoirFilter[ id ] = true );
            return;
        }

        this._reservoirs.forEach( r => this._reservoirFilter[ r.id ] = true );
    }

    setFromObject( savingsFormParams: SavingsFormParamsType ): SavingsFormParams {

        const formParams: FormParamsType = savingsFormParams;
        super.setFromObject( formParams );

        this._reservoirAggregation = savingsFormParams.reservoirAggregation;
        this._reservoirFilter = savingsFormParams.reservoirFilter;
            
        return this;
    }

    getAsObject(): SavingsFormParamsType {
        return {
            ...super.getAsObject(),
            reservoirAggregation: this._reservoirAggregation,
            reservoirFilter: this._reservoirFilter,
        }
    }

    getAsSearchObject(): SavingsSearchParamsType {

        const searchParams: SearchParamsType = super.getAsSearchObject();

        if ( searchParams.time_aggregation ) { 
            if ( searchParams.time_aggregation.startsWith( 'day' ) ) {
                delete searchParams.time_aggregation;
            }
        }
    
        const reservoir_filter: string = Object.entries( this._reservoirFilter )
            .filter( entry => entry[ 1 ] === true )
            .map( entry => entry[ 0 ] )
            .join( ',' );
    
        const savingsSearchParams: SavingsSearchParamsType = {
            ...searchParams, 
            reservoir_aggregation: this._reservoirAggregation,
            reservoir_filter,
        }
    
        return savingsSearchParams;    
    }
}

export { 
    FormParams,
    SavingsFormParams,
}