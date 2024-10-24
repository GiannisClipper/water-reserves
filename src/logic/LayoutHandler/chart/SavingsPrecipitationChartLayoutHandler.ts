import { ChartLayoutHandler } from ".";
import { ParamValues } from "@/logic/ParamValues";

import { timeRepr, valueRepr } from "@/logic/ValueHandler";

import { TimeValueHandler, SavingsChangeValueHandler } from "@/logic/ValueHandler/savings";
import { PrecipitationChangeValueHandler } from "@/logic/ValueHandler/precipitation";

import type { SearchParamsType } from "@/types/searchParams";

class SavingsPrecipitationMultiChartLayoutHandler extends ChartLayoutHandler {

    constructor( searchParams: SearchParamsType ) {

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
        } );
    }
}

export { 
    SavingsPrecipitationMultiChartLayoutHandler, 
};
