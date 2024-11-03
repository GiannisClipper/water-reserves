import DataParser from "@/logic/DataParser";
import { ListLayoutHandler, StandardListLayoutHandler } from "../_abstract";

import { 
    TimeValueHandler, 
    TemperatureMinValueHandler, TemperatureMeanValueHandler, TemperatureMaxValueHandler,
    TemperatureMinDifferenceValueHandler, TemperatureMeanDifferenceValueHandler, TemperatureMaxDifferenceValueHandler,
} from "@/logic/ValueHandler/temperature";

import { TEMPERATURE } from "@/app/settings";

import type { SearchParamsType } from "@/types/searchParams";
import { ValueHandler } from "@/logic/ValueHandler";

class TemperatureStandardListLayoutHandler extends StandardListLayoutHandler {

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {

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
            title: `${TEMPERATURE}`,
            labels,
            data: dataParser.data,
            valueHandlers
        } );
    }
}

class TemperatureListLayoutHandlerFactory {

    handler: ListLayoutHandler;

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {
    
        switch ( dataParser.type ) {

            case 'standard': {
                this.handler = new TemperatureStandardListLayoutHandler( searchParams, dataParser );
                break;
            }

            default:
                throw `Invalid type (${dataParser.type}) used in TemperatureListLayoutHandlerFactory`;
        }
    }
}

export { TemperatureListLayoutHandlerFactory };
