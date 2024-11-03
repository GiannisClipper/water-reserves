import DataParser from "@/logic/DataParser";
import { ListLayoutHandler, StandardListLayoutHandler } from "../_abstract";

import { TimeValueHandler, SavingsValueHandler, SavingsDifferenceValueHandler, SavingsChangeValueHandler } from "@/logic/ValueHandler/savings";
import { PrecipitationValueHandler, PrecipitationDifferenceValueHandler, PrecipitationChangeValueHandler } from "@/logic/ValueHandler/precipitation";

import { SAVINGS_PRECIPITATION } from "@/app/settings";

import type { SearchParamsType } from "@/types/searchParams";
import { ValueHandler } from "@/logic/ValueHandler";

class SavingsPrecipitationStandardListLayoutHandler extends StandardListLayoutHandler {

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {

        const valueHandlers: ValueHandler[] = [
            new TimeValueHandler(),
            new SavingsValueHandler(),
            new SavingsDifferenceValueHandler(),
            new SavingsChangeValueHandler(),
            new PrecipitationValueHandler(),
            new PrecipitationDifferenceValueHandler(),
            new PrecipitationChangeValueHandler(),
        ];

        super( {
            title: `${SAVINGS_PRECIPITATION}`,
            data: dataParser.data,
            valueHandlers
        } );
    }
}

class SavingsPrecipitationListLayoutHandlerFactory {

    handler: ListLayoutHandler;

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {
    
        switch ( dataParser.type ) {

            case 'standard': {
                this.handler = new SavingsPrecipitationStandardListLayoutHandler( searchParams, dataParser );
                break;
            }

            default:
                throw `Invalid type (${dataParser.type}) used in SavingsPrecipitationListLayoutHandlerFactory`;
        }
    }
}

export { SavingsPrecipitationListLayoutHandlerFactory };
