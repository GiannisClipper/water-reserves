import DataParser from "@/logic/DataParser";
import { ListLayoutHandler, StandardListLayoutHandler } from "../_abstract";

import { TimeValueHandler, SavingsValueHandler, SavingsDifferenceValueHandler, SavingsChangeValueHandler } from "@/logic/ValueHandler/savings";
import { ProductionValueHandler, ProductionDifferenceValueHandler, ProductionChangeValueHandler } from "@/logic/ValueHandler/production";

import { SAVINGS_PRODUCTION } from "@/app/settings";

import type { SearchParamsType } from "@/types/searchParams";
import { ValueHandler } from "@/logic/ValueHandler";

class SavingsProductionStandardListLayoutHandler extends StandardListLayoutHandler {

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {

        const valueHandlers: ValueHandler[] = [
            new TimeValueHandler(),
            new SavingsValueHandler(),
            new SavingsDifferenceValueHandler(),
            new SavingsChangeValueHandler(),
            new ProductionValueHandler(),
            new ProductionDifferenceValueHandler(),
            new ProductionChangeValueHandler(),
        ];

        super( {
            title: `${SAVINGS_PRODUCTION}`,
            data: dataParser.data,
            valueHandlers
        } );
    }
}

class SavingsProductionListLayoutHandlerFactory {

    handler: ListLayoutHandler;

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {
    
        switch ( dataParser.type ) {

            case 'standard': {
                this.handler = new SavingsProductionStandardListLayoutHandler( searchParams, dataParser );
                break;
            }

            default:
                throw `Invalid type (${dataParser.type}) used in SavingsProductionListLayoutHandlerFactory`;
        }
    }
}

export { SavingsProductionListLayoutHandlerFactory };
