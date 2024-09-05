import FormParams from "./FormParams";

import type { 
    SearchParamsType, 
    SavingsSearchParamsType 
} from "@/types/searchParams";

import type {
    ViewType, ChartType,
    FormParamsType, 
    SavingsFormParamsType 
} from "@/types/formParams";


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

export default SavingsFormParams;