import FormParams from "@/logic/savings/params/FormParams";

import type { 
    ViewType, ChartType,
    SearchParamsType, 
    SavingsSearchParamsType 
} from "@/types/searchParams";

import type {
    FormParamsType, 
    SavingsFormParamsType 
} from "@/types/formParams";


class SavingsFormParams extends FormParams {

    _reservoirs: { [ key: string ]: any }[] = [];
    _reservoirFilter: { [ key: string ]: boolean } = {};
    _reservoirAggregation: string | undefined = 'sum';

    constructor( savingsSearchParams: SavingsSearchParamsType, reservoirs: { [ key: string ]: any }[] ) {
        const searchParams: SearchParamsType = savingsSearchParams;
        super( searchParams );

        this._reservoirs = reservoirs;
        this.convertReservoirFilter( savingsSearchParams.reservoir_filter );
        this._reservoirAggregation = savingsSearchParams.reservoir_aggregation;

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

    set reservoirAggregation( val: string | undefined ) {
        this._reservoirAggregation = val ? val : this._reservoirAggregation;
    }

    setFromObject( savingsFormParams: SavingsFormParamsType ): SavingsFormParams {

        const formParams: FormParamsType = savingsFormParams;
        super.setFromObject( formParams );
        this._reservoirFilter = savingsFormParams.reservoirFilter;
        this._reservoirAggregation = savingsFormParams.reservoirAggregation;

        return this;
    }

    getAsObject(): SavingsFormParamsType {
        return {
            ...super.getAsObject(),
            reservoirFilter: this._reservoirFilter,
            reservoirAggregation: this._reservoirAggregation,
        }
    }

    getAsSearchObject(): SavingsSearchParamsType {

        const searchParams: SearchParamsType = super.getAsSearchObject();

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

    getAsQueryString(): string {
        return Object
            .entries( this.getAsSearchObject() )
            .map( entry => `${entry[ 0 ]}=${entry[ 1 ]}` ).join( '&' );
    }

}

export default SavingsFormParams;