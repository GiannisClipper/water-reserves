import { ChartLayoutHandler } from "../_abstract";
import { ParamValues } from "@/logic/ParamValues";

import { timeRepr, valueRepr } from "@/logic/ValueHandler";

import { TimeValueHandler, SavingsChangeValueHandler } from "@/logic/ValueHandler/savings";
import { PrecipitationChangeValueHandler } from "@/logic/ValueHandler/precipitation";

import type { SearchParamsType } from "@/types/searchParams";
import DataParser from "@/logic/DataParser";

import { TemporalXTicksCalculator } from "../_abstract/xTicks";
import { YTicksCalculator } from "../_abstract/yTicks";

class SavingsPrecipitationMultiChartLayoutHandler extends ChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers: [ 
                new SavingsChangeValueHandler(), 
                new PrecipitationChangeValueHandler()
            ],        
            title: 'Water reserves & precipitation',
            xLabel: timeRepr[ timeAggregation ],
            yLabel: valueRepr[ valueAggregation ] + ' (growth %)',
            data: dataParser.data,
            XTicksCalculator: TemporalXTicksCalculator,
            YTicksCalculator: YTicksCalculator
        } );
    }
}

class SavingsPrecipitationChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {
    
        switch ( dataParser.type ) {

            case 'multi': {
                this.handler = new SavingsPrecipitationMultiChartLayoutHandler( searchParams, dataParser );
                break;
            }

            default:
                throw `Invalid type (${dataParser.type}) used in SavingsPrecipitationChartLayoutHandlerFactory`;
        }
    }
}

export { 
    SavingsPrecipitationChartLayoutHandlerFactory,
    SavingsPrecipitationMultiChartLayoutHandler, 
};
