import { ChartLayoutHandler, SingleChartLayoutHandler } from ".";
import { ParamValues } from "@/logic/ParamValues";

import { ValueHandler, timeRepr, valueRepr } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    ProductionValueHandler, ProductionDifferenceValueHandler, ProductionPercentageValueHandler,
    FactoriesValueHandler, FactoriesSumValueHandler,
} from "@/logic/ValueHandler/production";

import type { SearchParamsType } from "@/types/searchParams";

class ProductionSingleChartLayoutHandler extends SingleChartLayoutHandler {

    constructor( searchParams: SearchParamsType ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers: [ new ProductionValueHandler() ],   
     
            title: 'Drinking water production (aggregated)',
            xLabel: timeRepr[ timeAggregation ],
            yLabel: valueRepr[ valueAggregation ] + ' (cubic meters)',

            yDifferenceValueHandlers: [ new ProductionDifferenceValueHandler() ],
            yPercentageValueHandlers: [ new ProductionPercentageValueHandler() ],
        } );
    }
}

class ProductionStackChartLayoutHandler extends ChartLayoutHandler {

    constructor( searchParams: SearchParamsType ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers: [ 
                new FactoriesValueHandler(), 
                new FactoriesSumValueHandler() 
            ],
            title: 'Drinking water production (per plant)',
            xLabel: timeRepr[ timeAggregation ],
            yLabel: valueRepr[ valueAggregation ] + ' (cubic meters)',
        } );
    }
}

export { 
    ProductionSingleChartLayoutHandler, 
    ProductionStackChartLayoutHandler,
};
