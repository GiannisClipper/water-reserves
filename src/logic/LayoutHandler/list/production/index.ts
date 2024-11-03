import DataParser from "@/logic/DataParser";
import { ListLayoutHandler, StandardListLayoutHandler } from "../_abstract";

import { ValueHandler } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    ProductionValueHandler, ProductionDifferenceValueHandler, ProductionChangeValueHandler,
    FactoriesValueHandler, FactoriesPercentageValueHandler,
    FactoriesSumValueHandler,
} from "@/logic/ValueHandler/production";

import { PRODUCTION } from "@/app/settings";

import type { SearchParamsType } from "@/types/searchParams";

class ProductionStandardListLayoutHandler extends StandardListLayoutHandler {

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {

        super( {
            title: `${PRODUCTION} (aggregated)`,
            data: dataParser.data,
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

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {

        const valueHandlers: ValueHandler[] = [
            new TimeValueHandler(),
            new FactoriesSumValueHandler()
        ];

        const labels: string[] = valueHandlers.map( h => h.label );

        for ( const factory of dataParser.legend.factories ) {

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
            title: `${PRODUCTION} (per plant)`,
            labels,
            data: dataParser.data,
            valueHandlers,
        } );
    }
}

class ProductionListLayoutHandlerFactory {

    handler: ListLayoutHandler;

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {
    
        switch ( dataParser.type ) {

            case 'standard': {
                this.handler = new ProductionStandardListLayoutHandler( searchParams, dataParser );
                break;
            }

            case 'stack': {
                this.handler = new ProductionStackListLayoutHandler( searchParams, dataParser );
                break;
            }

            default:
                throw `Invalid type (${dataParser.type}) used in ProductionListLayoutHandlerFactory`;
        }
    }
}

export { ProductionListLayoutHandlerFactory };
