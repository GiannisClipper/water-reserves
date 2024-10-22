import { ChartLayoutHandler } from ".";
import { ParamValues } from "@/logic/ParamValues";

import { timeRepr } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    TemperatureMinValueHandler, TemperatureMeanValueHandler, TemperatureMaxValueHandler 
} from "@/logic/ValueHandler/temperature";

import type { SearchParamsType } from "@/types/searchParams";

class TemperatureMultiChartLayoutHandler extends ChartLayoutHandler {

    constructor( searchParams: SearchParamsType ) {

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
        } );
    }
}

export { 
    TemperatureMultiChartLayoutHandler, 
};
