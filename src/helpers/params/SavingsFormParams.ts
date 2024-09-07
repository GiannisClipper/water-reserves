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

    constructor( savingsSearchParams: SavingsSearchParamsType ) {
        const searchParams: SearchParamsType = savingsSearchParams;
        super( searchParams );
        this.reservoirAggregation = savingsSearchParams.reservoir_aggregation;
    }

    set reservoirAggregation( val: string | undefined ) {
        this._reservoirAggregation = val ? val : this._reservoirAggregation;
    }

    setFromObject( savingsFormParams: SavingsFormParamsType ): SavingsFormParams {

        const formParams: FormParamsType = savingsFormParams;
        super.setFromObject( formParams );
        this._reservoirAggregation = savingsFormParams.reservoirAggregation;
            
        return this;
    }

    getAsObject(): SavingsFormParamsType {
        return {
            ...super.getAsObject(),
            reservoirAggregation: this._reservoirAggregation,
        }
    }

    getAsSearchObject(): SavingsSearchParamsType {

        const searchParams: SearchParamsType = super.getAsSearchObject();

        // if ( searchParams.time_aggregation ) { 
        //     if ( searchParams.time_aggregation.startsWith( 'day' ) ) {
        //         delete searchParams.time_aggregation;
        //     }
        // }
        
        const savingsSearchParams: SavingsSearchParamsType = {
            ...searchParams, 
            reservoir_aggregation: this._reservoirAggregation,
        }
    
        return savingsSearchParams;    
    }
}

export default SavingsFormParams;