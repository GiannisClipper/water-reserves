import DataParser from "@/logic/DataParser";
import { ListLayoutHandler, StandardListLayoutHandler } from "../_abstract";
import { ParamValues } from "@/logic/ParamValues";

import { ValueHandler, timeRepr, valueRepr } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    SavingsValueHandler, SavingsDifferenceValueHandler, SavingsChangeValueHandler,
    ReservoirsValueHandler, ReservoirsSumValueHandler,
    ReservoirsPercentageValueHandler,
} from "@/logic/ValueHandler/savings";

import type { SearchParamsType } from "@/types/searchParams";

class SavingsAggregatedListLayoutHandler extends StandardListLayoutHandler {

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {

        super( {
            title: 'Water reserves (aggregated)',
            data: dataParser.data,
            valueHandlers: [
                new TimeValueHandler(),
                new SavingsValueHandler(),
                new SavingsDifferenceValueHandler(),
                new SavingsChangeValueHandler(),
            ]
        } );
    }
}

class SavingsIndividualyListLayoutHandler extends StandardListLayoutHandler {

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {

        super( {
            title: 'Water reserves (per reservoir)',
            data: dataParser.data,
            valueHandlers: [
                new TimeValueHandler(),
                new SavingsValueHandler(),
                new SavingsDifferenceValueHandler(),
                new SavingsChangeValueHandler(),
            ]
        } );
    }
}

class SavingsListLayoutHandlerFactory {

    handler: ListLayoutHandler;

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {
    
        const params = new ParamValues( searchParams ).toJSON();
        const { valueAggregation } = params;

        if ( valueAggregation ) {
            this.handler = new SavingsAggregatedListLayoutHandler( searchParams, dataParser );
        } else {
            this.handler = new SavingsIndividualyListLayoutHandler( searchParams, dataParser );
        }
    }
}

export { SavingsListLayoutHandlerFactory };
