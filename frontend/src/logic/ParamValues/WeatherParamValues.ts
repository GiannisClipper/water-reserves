import ParamValues from "@/logic/ParamValues";

import type { 
    SearchParamsType, 
    WeatherSearchParamsType,
} from "@/types/searchParams";

import { ObjectType } from "@/types";

class WeatherParamValues extends ParamValues {

    _locations: { [ key: string ]: any }[] = [];
    _locationFilter: { [ key: string ]: boolean } = {};
    _locationAggregation: string | undefined;

    constructor( weatherSearchParams: WeatherSearchParamsType, locations: { [ key: string ]: any }[] ) {
        const searchParams: SearchParamsType = weatherSearchParams;
        super( searchParams );

        this._locations = locations;
        this.convertLocationFilter( weatherSearchParams.location_filter );
        this._locationAggregation = Object.keys( weatherSearchParams ).length
            ? weatherSearchParams.location_aggregation || ''
            : 'sum';
    }

    convertLocationFilter( val: string | undefined ) {

        if ( val ) {
            this._locations.forEach( r => this._locationFilter[ r.id ] = false );
            const ids = val.split( ',' );
            ids.forEach( id => this._locationFilter[ id ] = true );
            return;
        }

        this._locations.forEach( r => this._locationFilter[ r.id ] = true );
    }

    set locationAggregation( val: string | undefined ) {
        this._locationAggregation = val ? val : this._locationAggregation;
    }

    fromJSON( values: ObjectType ): WeatherParamValues {

        super.fromJSON( values );
        this._locationFilter = values.locationFilter;
        this._locationAggregation = values.locationAggregation;

        return this;
    }

    toJSON(): ObjectType {
        return {
            ...super.toJSON(),
            locationFilter: this._locationFilter,
            locationAggregation: this._locationAggregation,
        }
    }

    toSearchParams(): WeatherSearchParamsType {

        const searchParams: SearchParamsType = super.toSearchParams();

        const result: WeatherSearchParamsType = { ...searchParams };
    
        const location_filter: string = Object.entries( this._locationFilter )
            .filter( entry => entry[ 1 ] === true )
            .map( entry => entry[ 0 ] )
            .join( ',' );
    
        if ( location_filter ) {
            result.location_filter = location_filter
        }

        if ( this._locationAggregation ) {
            result.location_aggregation = this._locationAggregation
        }
    
        return result;    
    }

    toQueryString(): string {
        return Object
            .entries( this.toSearchParams() )
            .map( entry => `${entry[ 0 ]}=${entry[ 1 ]}` ).join( '&' );
    }
}

export default WeatherParamValues;