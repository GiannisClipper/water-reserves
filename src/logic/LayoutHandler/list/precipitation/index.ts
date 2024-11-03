import DataParser from "@/logic/DataParser";
import { ListLayoutHandler, StandardListLayoutHandler } from "../_abstract";

import { ValueHandler } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    PrecipitationValueHandler, PrecipitationDifferenceValueHandler, PrecipitationChangeValueHandler,
    LocationsValueHandler, LocationsPercentageValueHandler,
    LocationsSumValueHandler,
} from "@/logic/ValueHandler/precipitation";

import { PRECIPITATION } from "@/app/settings";

import type { SearchParamsType } from "@/types/searchParams";

class PrecipitationStandardListLayoutHandler extends StandardListLayoutHandler {

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {

        super( {
            title: `${PRECIPITATION} (aggregated)`,
            data: dataParser.data,
            valueHandlers: [
                new TimeValueHandler(),
                new PrecipitationValueHandler(),
                new PrecipitationDifferenceValueHandler(),
                new PrecipitationChangeValueHandler(),
            ]
        } );
    }
}

class PrecipitationStackListLayoutHandler extends StandardListLayoutHandler {

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {

        const valueHandlers: ValueHandler[] = [
            new TimeValueHandler(),
            new LocationsSumValueHandler()
        ];

        const labels: string[] = valueHandlers.map( h => h.label );

        for ( const location of dataParser.legend.locations ) {

            let handler = new LocationsValueHandler();
            handler.key = handler.key.replace( '{id}', location.id ) ;
            valueHandlers.push( handler ); 
            labels.push( location.name_en );

            handler = new LocationsPercentageValueHandler();
            handler.key = handler.key.replace( '{id}', location.id ) ;
            valueHandlers.push( handler ); 
            labels.push( location.name_en + '_' + handler.unit );
        }

        super( {
            title: `${PRECIPITATION} (per location)`,
            labels,
            data: dataParser.data,
            valueHandlers,
        } );
    }
}

class PrecipitationListLayoutHandlerFactory {

    handler: ListLayoutHandler;

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {
    
        switch ( dataParser.type ) {

            case 'standard': {
                this.handler = new PrecipitationStandardListLayoutHandler( searchParams, dataParser );
                break;
            }

            case 'stack': {
                this.handler = new PrecipitationStackListLayoutHandler( searchParams, dataParser );
                break;
            }

            default:
                throw `Invalid type (${dataParser.type}) used in PrecipitationListLayoutHandlerFactory`;
        }
    }
}

export { PrecipitationListLayoutHandlerFactory };
