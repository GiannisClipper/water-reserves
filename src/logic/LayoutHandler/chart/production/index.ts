import DataHandler from "@/logic/DataHandler";
import { ChartLayoutHandler, SingleChartLayoutHandler, StackChartLayoutHandler } from "..";
import { ParamValues } from "@/logic/ParamValues";

import { ValueHandler, timeRepr, valueRepr } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    ProductionValueHandler, ProductionDifferenceValueHandler, ProductionChangeValueHandler,
    FactoriesValueHandler, FactoriesSumValueHandler,
    FactoriesPercentageValueHandler,
} from "@/logic/ValueHandler/production";

import type { SearchParamsType } from "@/types/searchParams";

class ProductionSingleChartLayoutHandler extends SingleChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataHandler: DataHandler ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers: [ new ProductionValueHandler() ],   
     
            title: 'Drinking water production (aggregated)',
            xLabel: timeRepr[ timeAggregation ],
            yLabel: valueRepr[ valueAggregation ] + ' (cubic meters)',

            yDifferenceValueHandlers: [ new ProductionDifferenceValueHandler() ],
            yChangeValueHandlers: [ new ProductionChangeValueHandler() ],
            data: dataHandler.data,
        } );
    }
}

class ProductionStackChartLayoutHandler extends StackChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataHandler: DataHandler ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        // integrate legend values with data

        const yValueHandlers: ValueHandler[] = [];        
        const yPercentageValueHandlers: ValueHandler[] = [];        
        if ( dataHandler.legend ) {
            for ( const factory of dataHandler.legend.factories ) {

                const yValueHandler = new FactoriesValueHandler();
                yValueHandler.key = yValueHandler.key.replace( '{id}', factory.id );
                yValueHandler.label = factory.name_en;
                yValueHandlers.push( yValueHandler );

                const yPercentageValueHandler = new FactoriesPercentageValueHandler();
                yPercentageValueHandler.key = yPercentageValueHandler.key.replace( '{id}', factory.id );
                yPercentageValueHandlers.push( yPercentageValueHandler );
            }
            yValueHandlers.push( new FactoriesSumValueHandler() );
        }

        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers,
            title: 'Drinking water production (per plant)',
            xLabel: timeRepr[ timeAggregation ],
            yLabel: valueRepr[ valueAggregation ] + ' (cubic meters)',
            yPercentageValueHandlers,
            data: dataHandler.data,
        } );
    }
}

class ProductionChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( searchParams: SearchParamsType, dataHandler: DataHandler ) {
    
        switch ( dataHandler.type ) {

            case 'single': {
                this.handler = new ProductionSingleChartLayoutHandler( searchParams, dataHandler );
                break;
            }

            case 'stack': {
                this.handler = new ProductionStackChartLayoutHandler( searchParams, dataHandler );
                break;
            }

            default:
                throw `Invalid type (${dataHandler.type}) used in ProductionChartLayoutHandlerFactory`;
        }
    }
}


export { 
    ProductionChartLayoutHandlerFactory,
    ProductionSingleChartLayoutHandler, 
    ProductionStackChartLayoutHandler,
};
