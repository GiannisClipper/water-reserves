import { ListLayoutHandler, StandardListLayoutHandler } from "../_abstract";

import { TimeValueHandler, SavingsValueHandler, SavingsDifferenceValueHandler, SavingsChangeValueHandler } from "@/logic/ValueHandler/savings";
import { ProductionValueHandler, ProductionDifferenceValueHandler, ProductionChangeValueHandler } from "@/logic/ValueHandler/production";

import { SAVINGS_PRODUCTION } from "@/app/settings";
import { intervalRepr } from "@/logic/LayoutHandler";

import { ValueHandler } from "@/logic/ValueHandler";

import type { SearchParamsType } from "@/types/searchParams";
import type { ObjectType } from "@/types";

class SavingsProductionStandardListLayoutHandler extends StandardListLayoutHandler {

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {

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
            title: SAVINGS_PRODUCTION + intervalRepr( searchParams ),
            data: dataBox.data,
            valueHandlers
        } );
    }
}

class SavingsProductionListLayoutHandlerFactory {

    handler: ListLayoutHandler;

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {
    
        switch ( dataBox.type ) {

            case 'standard': {
                this.handler = new SavingsProductionStandardListLayoutHandler( searchParams, dataBox );
                break;
            }

            default:
                throw `Invalid type (${dataBox.type}) used in SavingsProductionListLayoutHandlerFactory`;
        }
    }
}

export { SavingsProductionListLayoutHandlerFactory };
