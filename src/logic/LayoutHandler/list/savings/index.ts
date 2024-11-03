import DataParser from "@/logic/DataParser";
import { ListLayoutHandler, StandardListLayoutHandler } from "../_abstract";
import { ParamValues } from "@/logic/ParamValues";

import { ValueHandler, timeRepr, valueRepr } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    SavingsValueHandler, SavingsDifferenceValueHandler, SavingsChangeValueHandler,
    ReservoirsNameValueHandler, ReservoirsValueHandler, ReservoirsPercentageValueHandler,
    ReservoirsSumValueHandler,
} from "@/logic/ValueHandler/savings";

import type { SearchParamsType } from "@/types/searchParams";

class SavingsStandardListLayoutHandler extends StandardListLayoutHandler {

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

class SavingsStackListLayoutHandler extends StandardListLayoutHandler {

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {

        const valueHandlers: ValueHandler[] = [
            new TimeValueHandler(),
            new ReservoirsSumValueHandler()
        ];

        const labels: string[] = valueHandlers.map( h => h.label );

        for ( const reservoir of dataParser.legend.reservoirs ) {

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
            title: 'Water reserves (per reservoir)',
            labels,
            data: dataParser.data,
            valueHandlers,
        } );
    }
}

class SavingsListLayoutHandlerFactory {

    handler: ListLayoutHandler;

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {
    
        switch ( dataParser.type ) {

            case 'standard': {
                this.handler = new SavingsStandardListLayoutHandler( searchParams, dataParser );
                break;
            }

            case 'stack': {
                this.handler = new SavingsStackListLayoutHandler( searchParams, dataParser );
                break;
            }

            default:
                throw `Invalid type (${dataParser.type}) used in SavingsListLayoutHandlerFactory`;
        }
    }
}

export { SavingsListLayoutHandlerFactory };
