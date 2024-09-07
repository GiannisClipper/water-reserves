import FormParams from "./FormParams";

import type { 
    SearchParamsType, 
    SavingsReservoirSearchParamsType 
} from "@/types/searchParams";

import type {
    ViewType, ChartType,
    FormParamsType, 
    SavingsReservoirFormParamsType 
} from "@/types/formParams";


class SavingsReservoirFormParams extends FormParams {

    _reservoirFilter: { [ key: string ]: boolean } = {};
    _reservoirs: { [ key: string ]: any }[] = [];

    constructor( savingsReservoirSearchParams: SavingsReservoirSearchParamsType, reservoirs: { [ key: string ]: any }[] ) {
        const searchParams: SearchParamsType = savingsReservoirSearchParams;
        super( searchParams );

        this._reservoirs = reservoirs;
        this.convertReservoirFilter( savingsReservoirSearchParams.reservoir_filter );
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

    setFromObject( savingsFormParams: SavingsReservoirFormParamsType ): SavingsReservoirFormParams {

        const formParams: FormParamsType = savingsFormParams;
        super.setFromObject( formParams );
        this._reservoirFilter = savingsFormParams.reservoirFilter;
            
        return this;
    }

    getAsObject(): SavingsReservoirFormParamsType {
        return {
            ...super.getAsObject(),
            reservoirFilter: this._reservoirFilter,
        }
    }

    getAsSearchObject(): SavingsReservoirSearchParamsType {

        const searchParams: SearchParamsType = super.getAsSearchObject();
    
        const reservoir_filter: string = Object.entries( this._reservoirFilter )
            .filter( entry => entry[ 1 ] === true )
            .map( entry => entry[ 0 ] )
            .join( ',' );
    
        const result: SavingsReservoirSearchParamsType = {
            ...searchParams, 
            reservoir_filter,
        }
    
        return result;    
    }
}

export default SavingsReservoirFormParams;