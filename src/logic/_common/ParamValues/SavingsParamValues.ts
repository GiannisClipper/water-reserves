import ParamValues from "@/logic/_common/ParamValues";

import type { 
    ViewType, ChartType,
    SearchParamsType, 
    SavingsSearchParamsType 
} from "@/types/searchParams";

import type {
    ParamValuesType, 
    SavingsParamValuesType 
} from "@/types/paramValues";


class SavingsParamValues extends ParamValues {

    _reservoirs: { [ key: string ]: any }[] = [];
    _reservoirFilter: { [ key: string ]: boolean } = {};
    _reservoirAggregation: string | undefined;

    constructor( savingsSearchParams: SavingsSearchParamsType, reservoirs: { [ key: string ]: any }[] ) {
        const searchParams: SearchParamsType = savingsSearchParams;
        super( searchParams );

        this._reservoirs = reservoirs;
        this.convertReservoirFilter( savingsSearchParams.reservoir_filter );
        this._reservoirAggregation = Object.keys( savingsSearchParams ).length
            ? savingsSearchParams.reservoir_aggregation || ''
            : 'sum';
    }

    convertReservoirFilter( val: string | undefined ) {

        if ( val ) {
            this._reservoirs.forEach( r => this._reservoirFilter[ r.id ] = false );
            const ids = val.split( ',' );
            ids.forEach( id => this._reservoirFilter[ id ] = true );
            return;
        }

        this._reservoirs.forEach( r => this._reservoirFilter[ r.id ] = true );
    }

    set reservoirAggregation( val: string | undefined ) {
        this._reservoirAggregation = val ? val : this._reservoirAggregation;
    }

    fromJSON( savingsParamValues: SavingsParamValuesType ): SavingsParamValues {

        const formParams: ParamValuesType = savingsParamValues;
        super.fromJSON( formParams );
        this._reservoirFilter = savingsParamValues.reservoirFilter;
        this._reservoirAggregation = savingsParamValues.reservoirAggregation;

        return this;
    }

    toJSON(): SavingsParamValuesType {
        return {
            ...super.toJSON(),
            reservoirFilter: this._reservoirFilter,
            reservoirAggregation: this._reservoirAggregation,
        }
    }

    toSearchParams(): SavingsSearchParamsType {

        const searchParams: SearchParamsType = super.toSearchParams();

        const result: SavingsSearchParamsType = { ...searchParams };
    
        const reservoir_filter: string = Object.entries( this._reservoirFilter )
            .filter( entry => entry[ 1 ] === true )
            .map( entry => entry[ 0 ] )
            .join( ',' );
    
        if ( reservoir_filter ) {
            result.reservoir_filter = reservoir_filter
        }

        if ( this._reservoirAggregation ) {
            result.reservoir_aggregation = this._reservoirAggregation
        }
    
        return result;    
    }

    toQueryString(): string {
        return Object
            .entries( this.toSearchParams() )
            .map( entry => `${entry[ 0 ]}=${entry[ 1 ]}` ).join( '&' );
    }
}

export default SavingsParamValues;