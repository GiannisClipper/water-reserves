import { ChartLayoutHandler, StackChartLayoutHandler, StandardChartLayoutHandler } from "../_abstract";
import { ParamValues } from "@/logic/ParamValues";

import { ValueHandler, timeRepr, valueRepr } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    ProductionValueHandler, ProductionDifferenceValueHandler, ProductionChangeValueHandler,
    FactoriesValueHandler, FactoriesSumValueHandler,
    FactoriesPercentageValueHandler,
} from "@/logic/ValueHandler/production";

import { TemporalXTicksCalculator } from "../_abstract/xTicks";
import { YTicksCalculator } from "../_abstract/yTicks";

import type { SearchParamsType } from "@/types/searchParams";
import type { ObjectType } from "@/types";

class ProductionStandardChartLayoutHandler extends StandardChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {

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
            dataBox: dataBox,
            XTicksCalculator: TemporalXTicksCalculator,
            YTicksCalculator
        } );
    }
}

class ProductionStackChartLayoutHandler extends StackChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        // integrate legend values with data

        const yValueHandlers: ValueHandler[] = [];        
        const yPercentageValueHandlers: ValueHandler[] = [];        
        if ( dataBox.legend ) {
            for ( const factory of dataBox.legend.factories ) {

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
            dataBox: dataBox,
            XTicksCalculator: TemporalXTicksCalculator,
            YTicksCalculator
        } );
    }
}

class ProductionChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {
    
        switch ( dataBox.type ) {

            case 'standard': {
                this.handler = new ProductionStandardChartLayoutHandler( searchParams, dataBox );
                break;
            }

            case 'stack': {
                this.handler = new ProductionStackChartLayoutHandler( searchParams, dataBox );
                break;
            }

            default:
                throw `Invalid type (${dataBox.type}) used in ProductionChartLayoutHandlerFactory`;
        }
    }
}


export { 
    ProductionChartLayoutHandlerFactory,
    ProductionStandardChartLayoutHandler, 
    ProductionStackChartLayoutHandler,
};
