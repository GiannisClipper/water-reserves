import { ListLayoutHandler, StandardListLayoutHandler } from "../_abstract";

import { ValueHandler } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    SavingsValueHandler, SavingsDifferenceValueHandler, SavingsChangeValueHandler,
    ReservoirsValueHandler, ReservoirsPercentageValueHandler,
    ReservoirsSumValueHandler,
} from "@/logic/ValueHandler/savings";

import { SAVINGS } from "@/app/settings";
import { intervalRepr } from "@/logic/LayoutHandler";

import type { SearchParamsType } from "@/types/searchParams";
import type { ObjectType } from "@/types";

class SavingsStandardListLayoutHandler extends StandardListLayoutHandler {

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {

        super( {
            title: SAVINGS + intervalRepr( searchParams ),
            dataBox: dataBox,
            valueHandlers: [
                new TimeValueHandler(),
                new SavingsValueHandler(),
                new SavingsDifferenceValueHandler(),
                new SavingsChangeValueHandler(),
            ]
        } );
    }
}

class SavingsStackListLayoutHandler extends StandardListLayoutHandler {

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {

        const valueHandlers: ValueHandler[] = [
            new TimeValueHandler(),
            new ReservoirsSumValueHandler()
        ];

        const labels: string[] = valueHandlers.map( h => h.label );

        for ( const reservoir of dataBox.legend.reservoirs ) {

            let handler = new ReservoirsValueHandler();
            handler.key = handler.key.replace( '{id}', reservoir.id ) ;
            valueHandlers.push( handler ); 
            labels.push( reservoir.name_en );

            handler = new ReservoirsPercentageValueHandler();
            handler.key = handler.key.replace( '{id}', reservoir.id ) ;
            valueHandlers.push( handler ); 
            labels.push( handler.unit );
        }

        super( {
            title: SAVINGS + intervalRepr( searchParams ),
            labels,
            dataBox: dataBox,
            valueHandlers,
        } );
    }
}

class SavingsListLayoutHandlerFactory {

    handler: ListLayoutHandler;

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {
    
        switch ( dataBox.type ) {

            case 'standard': {
                this.handler = new SavingsStandardListLayoutHandler( searchParams, dataBox );
                break;
            }

            case 'stack': {
                this.handler = new SavingsStackListLayoutHandler( searchParams, dataBox );
                break;
            }

            default:
                throw `Invalid type (${dataBox.type}) used in SavingsListLayoutHandlerFactory`;
        }
    }
}

export { SavingsListLayoutHandlerFactory };
