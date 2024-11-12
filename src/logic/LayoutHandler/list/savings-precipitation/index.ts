import { ListLayoutHandler, StandardListLayoutHandler } from "../_abstract";

import { TimeValueHandler, SavingsValueHandler, SavingsDifferenceValueHandler, SavingsChangeValueHandler } from "@/logic/ValueHandler/savings";
import { PrecipitationValueHandler, PrecipitationDifferenceValueHandler, PrecipitationChangeValueHandler } from "@/logic/ValueHandler/precipitation";

import { SAVINGS_PRECIPITATION } from "@/app/settings";
import { intervalRepr } from "@/logic/LayoutHandler";

import { ValueHandler } from "@/logic/ValueHandler";

import type { SearchParamsType } from "@/types/searchParams";
import type { ObjectType } from "@/types";

class SavingsPrecipitationStandardListLayoutHandler extends StandardListLayoutHandler {

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {

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
            title: SAVINGS_PRECIPITATION + intervalRepr( searchParams ),
            dataBox: dataBox,
            valueHandlers
        } );
    }
}

class SavingsPrecipitationListLayoutHandlerFactory {

    handler: ListLayoutHandler;

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {
    
        switch ( dataBox.type ) {

            case 'standard': {
                this.handler = new SavingsPrecipitationStandardListLayoutHandler( searchParams, dataBox );
                break;
            }

            default:
                throw `Invalid type (${dataBox.type}) used in SavingsPrecipitationListLayoutHandlerFactory`;
        }
    }
}

export { SavingsPrecipitationListLayoutHandlerFactory };
