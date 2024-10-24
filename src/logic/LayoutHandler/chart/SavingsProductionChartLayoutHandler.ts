import { ChartLayoutHandler } from ".";
import { ParamValues } from "@/logic/ParamValues";

import { timeRepr, valueRepr } from "@/logic/ValueHandler";

import { TimeValueHandler, SavingsChangeValueHandler } from "@/logic/ValueHandler/savings";
import { ProductionChangeValueHandler } from "@/logic/ValueHandler/production";

import type { SearchParamsType } from "@/types/searchParams";

class SavingsProductionMultiChartLayoutHandler extends ChartLayoutHandler {

    constructor( searchParams: SearchParamsType ) {

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
        } );
    }
}

export { 
    SavingsProductionMultiChartLayoutHandler, 
};
