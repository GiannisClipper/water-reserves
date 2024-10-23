import { ChartLayoutHandler } from ".";
import { ParamValues } from "@/logic/ParamValues";

import { timeRepr, valueRepr } from "@/logic/ValueHandler";

import { TimeValueHandler, SavingsPercentageValueHandler } from "@/logic/ValueHandler/savings";
import { PrecipitationPercentageValueHandler } from "@/logic/ValueHandler/precipitation";

import type { SearchParamsType } from "@/types/searchParams";

class SavingsPrecipitationMultiChartLayoutHandler extends ChartLayoutHandler {

    constructor( searchParams: SearchParamsType ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers: [ 
                new SavingsPercentageValueHandler(), 
                new PrecipitationPercentageValueHandler()
            ],        
            title: 'Water reserves & precipitation',
            xLabel: timeRepr[ timeAggregation ],
            yLabel: valueRepr[ valueAggregation ] + ' (change %)',
        } );
    }
}

export { 
    SavingsPrecipitationMultiChartLayoutHandler, 
};
