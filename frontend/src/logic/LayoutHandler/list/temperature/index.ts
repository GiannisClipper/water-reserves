import { ListLayoutHandler, StandardListLayoutHandler } from "../_abstract";

import { 
    TimeValueHandler, 
    TemperatureMinValueHandler, TemperatureMeanValueHandler, TemperatureMaxValueHandler,
    TemperatureMinDifferenceValueHandler, TemperatureMeanDifferenceValueHandler, TemperatureMaxDifferenceValueHandler,
} from "@/logic/ValueHandler/temperature";

import { TEMPERATURE } from "@/app/settings";
import { intervalRepr } from "@/logic/LayoutHandler";

import { ValueHandler } from "@/logic/ValueHandler";

import type { SearchParamsType } from "@/types/searchParams";
import type { ObjectType } from "@/types";

class TemperatureStandardListLayoutHandler extends StandardListLayoutHandler {

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {

        const valueHandlers: ValueHandler[] = [
            new TimeValueHandler(),
            new TemperatureMinValueHandler(),
            new TemperatureMinDifferenceValueHandler(),
            new TemperatureMeanValueHandler(),
            new TemperatureMeanDifferenceValueHandler(),
            new TemperatureMaxValueHandler(),
            new TemperatureMaxDifferenceValueHandler()
        ];

        const labels: string[] = valueHandlers.map( h => h.label );

        labels[ 2 ] = labels[ 1 ] + '_diff';
        labels[ 4 ] = labels[ 3 ] + '_diff';
        labels[ 6 ] = labels[ 5 ] + '_diff';

        super( {
            title: TEMPERATURE + intervalRepr( searchParams ),
            labels,
            dataBox: dataBox,
            valueHandlers
        } );
    }
}

class TemperatureListLayoutHandlerFactory {

    handler: ListLayoutHandler;

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {
    
        switch ( dataBox.type ) {

            case 'standard': {
                this.handler = new TemperatureStandardListLayoutHandler( searchParams, dataBox );
                break;
            }

            default:
                throw `Invalid type (${dataBox.type}) used in TemperatureListLayoutHandlerFactory`;
        }
    }
}

export { TemperatureListLayoutHandlerFactory };
