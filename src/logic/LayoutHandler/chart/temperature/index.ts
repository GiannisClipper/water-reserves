import DataParser from "@/logic/DataParser";
import { ChartLayoutHandler } from "../_abstract";
import { ParamValues } from "@/logic/ParamValues";

import { timeRepr } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    TemperatureMinValueHandler, TemperatureMeanValueHandler, TemperatureMaxValueHandler 
} from "@/logic/ValueHandler/temperature";

import { TemporalXTicksCalculator } from "../_abstract/xTicks";
import { YTicksCalculator } from "../_abstract/yTicks";

import type { SearchParamsType } from "@/types/searchParams";

class TemperatureMultiChartLayoutHandler extends ChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers: [ 
                new TemperatureMinValueHandler(), 
                new TemperatureMeanValueHandler(),
                new TemperatureMaxValueHandler()
            ],        
            title: 'Temperatures in Athens',
            xLabel: timeRepr[ timeAggregation ],
            yLabel: 'Celcius degrees',
            data: dataParser.data,
            XTicksCalculator: TemporalXTicksCalculator,
            YTicksCalculator,
        } );
    }
}

class TemperatureChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {
    
        switch ( dataParser.type ) {

            case 'multi': {
                this.handler = new TemperatureMultiChartLayoutHandler( searchParams, dataParser );
                break;
            }

            default:
                throw `Invalid type (${dataParser.type}) used in TemperatureChartLayoutHandlerFactory`;
        }
    }
}

export { 
    TemperatureChartLayoutHandlerFactory,
    TemperatureMultiChartLayoutHandler, 
};
