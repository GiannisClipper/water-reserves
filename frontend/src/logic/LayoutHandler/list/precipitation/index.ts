import { ListLayoutHandler, StandardListLayoutHandler } from "../_abstract";

import { ValueHandler } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    PrecipitationValueHandler, PrecipitationDifferenceValueHandler, PrecipitationChangeValueHandler,
    LocationsValueHandler, LocationsPercentageValueHandler,
    LocationsSumValueHandler,
} from "@/logic/ValueHandler/precipitation";

import { PRECIPITATION } from "@/app/settings";
import { intervalRepr } from "@/logic/LayoutHandler";

import type { SearchParamsType } from "@/types/searchParams";
import type { ObjectType } from "@/types";

class PrecipitationStandardListLayoutHandler extends StandardListLayoutHandler {

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {

        super( {
            title: PRECIPITATION + intervalRepr( searchParams ),
            dataBox: dataBox,
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

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {

        const valueHandlers: ValueHandler[] = [
            new TimeValueHandler(),
            new LocationsSumValueHandler()
        ];

        const labels: string[] = valueHandlers.map( h => h.label );

        for ( const location of dataBox.legend.locations ) {

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
            title: PRECIPITATION + intervalRepr( searchParams ),
            labels,
            dataBox: dataBox,
            valueHandlers,
        } );
    }
}

class PrecipitationListLayoutHandlerFactory {

    handler: ListLayoutHandler;

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {
    
        switch ( dataBox.type ) {

            case 'standard': {
                this.handler = new PrecipitationStandardListLayoutHandler( searchParams, dataBox );
                break;
            }

            case 'stack': {
                this.handler = new PrecipitationStackListLayoutHandler( searchParams, dataBox );
                break;
            }

            default:
                throw `Invalid type (${dataBox.type}) used in PrecipitationListLayoutHandlerFactory`;
        }
    }
}

export { PrecipitationListLayoutHandlerFactory };
