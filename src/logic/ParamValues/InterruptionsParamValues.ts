import ParamValues from "@/logic/ParamValues";

import type { 
    SearchParamsType, 
    SavingsSearchParamsType, 
    InterruptionsSearchParamsType
} from "@/types/searchParams";

import { ObjectType } from "@/types";

class InterruptionsParamValues extends ParamValues {

    _municipalityAggregation: string = 'sum';

    constructor( interruptionsSearchParams: SavingsSearchParamsType, municipalities: { [ key: string ]: any }[] ) {
        const searchParams: SearchParamsType = interruptionsSearchParams;
        super( searchParams );
    }

    fromJSON( values: ObjectType ): InterruptionsParamValues {
        super.fromJSON( values );
        return this;
    }

    toJSON(): ObjectType {
        return {
            ...super.toJSON(),
            municipalityAggregation: this._municipalityAggregation,
        }
    }

    toSearchParams(): InterruptionsSearchParamsType {

        const searchParams: SearchParamsType = super.toSearchParams();

        const result: InterruptionsSearchParamsType = { 
            ...searchParams,
            municipality_aggregation: this._municipalityAggregation
         };
    
        return result;    
    }

    toQueryString(): string {
        return Object
            .entries( this.toSearchParams() )
            .map( entry => `${entry[ 0 ]}=${entry[ 1 ]}` ).join( '&' );
    }
}

export default InterruptionsParamValues;