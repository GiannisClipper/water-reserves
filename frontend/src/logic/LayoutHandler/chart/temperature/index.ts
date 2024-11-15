import { ChartLayoutHandler, StandardChartLayoutHandler } from "../_abstract";
import { ParamValues } from "@/logic/ParamValues";

import { timeRepr } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    TemperatureMinValueHandler, TemperatureMeanValueHandler, TemperatureMaxValueHandler,
    TemperatureMinDifferenceValueHandler, TemperatureMeanDifferenceValueHandler, TemperatureMaxDifferenceValueHandler,
} from "@/logic/ValueHandler/temperature";

import { intervalRepr } from "@/logic/LayoutHandler";
import { TemporalXTicksCalculator } from "../_abstract/xTicks";
import { YTicksCalculator } from "../_abstract/yTicks";

import type { SearchParamsType } from "@/types/searchParams";
import type { ObjectType } from "@/types";

class TemperatureChartLayoutHandler extends StandardChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers: [ 
                new TemperatureMinValueHandler(), 
                new TemperatureMeanValueHandler(),
                new TemperatureMaxValueHandler()
            ],
            yDifferenceValueHandlers: [
                new TemperatureMinDifferenceValueHandler(), 
                new TemperatureMeanDifferenceValueHandler(),
                new TemperatureMaxDifferenceValueHandler()  
            ],
            yChangeValueHandlers: [],
            title: 'Temperature in Athens' + intervalRepr( searchParams ),
            xLabel: timeRepr[ timeAggregation ],
            yLabel: 'Celcius degrees',
            dataBox: dataBox,
            XTicksCalculator: TemporalXTicksCalculator,
            YTicksCalculator,
        } );
    }
}

class TemperatureChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {
    
        switch ( dataBox.type ) {

            case 'standard': {
                this.handler = new TemperatureChartLayoutHandler( searchParams, dataBox );
                break;
            }

            default:
                throw `Invalid type (${dataBox.type}) used in TemperatureChartLayoutHandlerFactory`;
        }
    }
}

export { 
    TemperatureChartLayoutHandlerFactory,
    TemperatureChartLayoutHandler, 
};
