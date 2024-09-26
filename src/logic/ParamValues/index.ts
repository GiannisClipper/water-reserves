import type { 
    ViewType, ChartType,
    SearchParamsType, 
} from "@/types/searchParams";

import type {
    ParamValuesType, 
} from "@/types/paramValues";
import { ObjectType } from "@/types";


class ParamValues {

    _chartType: ChartType = 'line';

    _fromDate: string = '';
    _toDate: string = '';

    _fromInterval: string = '';
    _toInterval: string = '';

    _timeAggregation: string = '';
    _valueAggregation: string = '';

    constructor( searchParams: SearchParamsType ) {

        this.chartType = searchParams.chart_type;

        this.convertTimeRange( searchParams.time_range );
        this.convertIntervalFilter( searchParams.interval_filter );

        this.timeAggregation = searchParams.time_aggregation;
        this.yearStart = searchParams.year_start;

        this.valueAggregation = searchParams.time_aggregation;
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

        if ( val && val.includes( ',' ) ) {
            val = val.split( ',' )[ 0 ];
        }

        this._timeAggregation = val && [ "month", "year" ].includes( val )
            ? val 
            : '';
    }

    set yearStart( val: string | undefined ) {

        if ( val ) {
            this._timeAggregation = 'custom_year';
        }
    }

    set valueAggregation( val: string | undefined ) {

        if ( val && val.includes( ',' ) ) {
            val = val.split( ',' )[ 1 ];
        }

        this._valueAggregation = val ? val : "";
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

    convertTimeAggregation( val: string | undefined ) {

        if ( val && val.includes( ',' ) ) {
            this._valueAggregation = val.split( ',' )[ 1 ];
        } else {
            this._valueAggregation = '';
        }
    }

    fromJSON( values: ObjectType ): ParamValues {

        this._chartType = values.chartType;
    
        this._fromDate = values.fromDate;
        this._toDate = values.toDate;
    
        this._fromInterval = values.fromInterval;
        this._toInterval = values.toInterval;
    
        this._timeAggregation = values.timeAggregation;
        this._valueAggregation = values.valueAggregation;
        
        return this;
    }

    toJSON(): ObjectType {
        return { 
            chartType: this._chartType,

            fromDate: this._fromDate,
            toDate: this._toDate,

            fromInterval: this._fromInterval,
            toInterval: this._toInterval,

            timeAggregation: this._timeAggregation,
            valueAggregation: this._valueAggregation,
        };  
    }

    toSearchParams(): SearchParamsType {

        const searchParams: SearchParamsType = {};

        searchParams.chart_type = this._chartType;
    
        if ( this._fromDate && this._toDate ) {
            searchParams.time_range = `${this._fromDate},${this._toDate}`;
        }
    
        if ( this._fromInterval && this._toInterval ) {
            searchParams.interval_filter = `${this._fromInterval},${this._toInterval}`;
        }
    
        if ( this._timeAggregation ) {
            searchParams.time_aggregation = this._timeAggregation;
        }

        if ( this._timeAggregation === 'custom_year' ) {
            searchParams.time_aggregation = 'year';
            searchParams.year_start = '10-01';
        }

        if ( this._valueAggregation ) {
            searchParams.time_aggregation += `,${this._valueAggregation}`;
        }

        return searchParams;
    }

    toQueryString(): string {
        return Object
            .entries( this.toSearchParams() )
            .map( entry => `${entry[ 0 ]}=${entry[ 1 ]}` ).join( '&' );
    }
}

export default ParamValues;