import { ChartLayoutHandler } from "../_abstract";
import { ParamValues } from "@/logic/ParamValues";

import { timeRepr, valueRepr } from "@/logic/ValueHandler";

import { TimeValueHandler, SavingsChangeValueHandler } from "@/logic/ValueHandler/savings";
import { ProductionChangeValueHandler } from "@/logic/ValueHandler/production";

import type { SearchParamsType } from "@/types/searchParams";
import DataHandler from "@/logic/DataHandler";

import { TemporalXTicksCalculator } from "../_abstract/xTicks";
import { YTicksCalculator } from "../_abstract/yTicks";

class SavingsProductionMultiChartLayoutHandler extends ChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataHandler: DataHandler ) {

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
            data: dataHandler.data,
            XTicksCalculator: TemporalXTicksCalculator,
            YTicksCalculator,
        } );
    }
}

class SavingsProductionChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( searchParams: SearchParamsType, dataHandler: DataHandler ) {
    
        switch ( dataHandler.type ) {

            case 'multi': {
                this.handler = new SavingsProductionMultiChartLayoutHandler( searchParams, dataHandler );
                break;
            }

            default:
                throw `Invalid type (${dataHandler.type}) used in SavingsProductionChartLayoutHandlerFactory`;
        }
    }
}

export { 
    SavingsProductionChartLayoutHandlerFactory,
    SavingsProductionMultiChartLayoutHandler, 
};
