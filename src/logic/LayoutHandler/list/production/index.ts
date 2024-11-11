import { ListLayoutHandler, StandardListLayoutHandler } from "../_abstract";

import { ValueHandler } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    ProductionValueHandler, ProductionDifferenceValueHandler, ProductionChangeValueHandler,
    FactoriesValueHandler, FactoriesPercentageValueHandler,
    FactoriesSumValueHandler,
} from "@/logic/ValueHandler/production";

import { PRODUCTION } from "@/app/settings";
import { intervalRepr } from "@/logic/LayoutHandler";

import type { SearchParamsType } from "@/types/searchParams";
import type { ObjectType } from "@/types";

class ProductionStandardListLayoutHandler extends StandardListLayoutHandler {

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {

        super( {
            title: PRODUCTION + intervalRepr( searchParams ),
            data: dataBox.data,
            valueHandlers: [
                new TimeValueHandler(),
                new ProductionValueHandler(),
                new ProductionDifferenceValueHandler(),
                new ProductionChangeValueHandler(),
            ]
        } );
    }
}

class ProductionStackListLayoutHandler extends StandardListLayoutHandler {

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {

        const valueHandlers: ValueHandler[] = [
            new TimeValueHandler(),
            new FactoriesSumValueHandler()
        ];

        const labels: string[] = valueHandlers.map( h => h.label );

        for ( const factory of dataBox.legend.factories ) {

            let handler = new FactoriesValueHandler();
            handler.key = handler.key.replace( '{id}', factory.id ) ;
            valueHandlers.push( handler ); 
            labels.push( factory.name_en );

            handler = new FactoriesPercentageValueHandler();
            handler.key = handler.key.replace( '{id}', factory.id ) ;
            valueHandlers.push( handler ); 
            labels.push( handler.unit );
        }

        super( {
            title: PRODUCTION + intervalRepr( searchParams ),
            labels,
            data: dataBox.data,
            valueHandlers,
        } );
    }
}

class ProductionListLayoutHandlerFactory {

    handler: ListLayoutHandler;

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {
    
        switch ( dataBox.type ) {

            case 'standard': {
                this.handler = new ProductionStandardListLayoutHandler( searchParams, dataBox );
                break;
            }

            case 'stack': {
                this.handler = new ProductionStackListLayoutHandler( searchParams, dataBox );
                break;
            }

            default:
                throw `Invalid type (${dataBox.type}) used in ProductionListLayoutHandlerFactory`;
        }
    }
}

export { ProductionListLayoutHandlerFactory };
