import { ChartLayoutHandler } from "../_abstract";
import { ParamValues } from "@/logic/ParamValues";

import { timeRepr, valueRepr } from "@/logic/ValueHandler";

import { TimeValueHandler, SavingsChangeValueHandler } from "@/logic/ValueHandler/savings";
import { ProductionChangeValueHandler } from "@/logic/ValueHandler/production";

import type { SearchParamsType } from "@/types/searchParams";
import DataParser from "@/logic/DataParser";

import { TemporalXTicksCalculator } from "../_abstract/xTicks";
import { YTicksCalculator } from "../_abstract/yTicks";

class SavingsProductionMultiChartLayoutHandler extends ChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers: [ 
                new SavingsChangeValueHandler(), 
                new ProductionChangeValueHandler()
            ],        
            title: 'Water reserves & drinking water production',
            xLabel: timeRepr[ timeAggregation ],
            yLabel: valueRepr[ valueAggregation ] + ' (growth %)',
            data: dataParser.data,
            XTicksCalculator: TemporalXTicksCalculator,
            YTicksCalculator,
        } );
    }
}

class SavingsProductionChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {
    
        switch ( dataParser.type ) {

            case 'standard': {
                this.handler = new SavingsProductionMultiChartLayoutHandler( searchParams, dataParser );
                break;
            }

            default:
                throw `Invalid type (${dataParser.type}) used in SavingsProductionChartLayoutHandlerFactory`;
        }
    }
}

export { 
    SavingsProductionChartLayoutHandlerFactory,
    SavingsProductionMultiChartLayoutHandler, 
};
