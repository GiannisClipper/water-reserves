import ParamValues from "@/logic/ParamValues";

import type { 
    SearchParamsType, 
    SavingsSearchParamsType, 
    InterruptionsSearchParamsType
} from "@/types/searchParams";

import { ObjectType } from "@/types";

class InterruptionsParamValues extends ParamValues {

    constructor( interruptionsSearchParams: SavingsSearchParamsType, municipalities: { [ key: string ]: any }[] ) {
        const searchParams: SearchParamsType = interruptionsSearchParams;
        super( searchParams );
    }

    get municipalityAggregation() {
        return this._timeAggregation !== 'alltime' 
            ? 'sum' 
            : '';
    }

    fromJSON( values: ObjectType ): InterruptionsParamValues {
        super.fromJSON( values );
        return this;
    }

    toJSON(): ObjectType {
        return {
            ...super.toJSON(),
            municipalityAggregation: this.municipalityAggregation,
        }
    }

    toSearchParams(): InterruptionsSearchParamsType {

        const searchParams: SearchParamsType = super.toSearchParams();

        const result: InterruptionsSearchParamsType = { 
            ...searchParams,
            municipality_aggregation: this.municipalityAggregation
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