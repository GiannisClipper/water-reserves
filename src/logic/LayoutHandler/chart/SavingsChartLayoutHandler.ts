import { ChartLayoutHandler } from ".";
import { ParamValues } from "@/logic/ParamValues";

import { ValueHandler, timeRepr, valueRepr } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    SavingsValueHandler, SavingsDifferenceValueHandler, SavingsPercentageValueHandler,
    ReservoirsValueHandler, ReservoirsSumValueHandler,
} from "@/logic/ValueHandler/savings";

import type { SearchParamsType } from "@/types/searchParams";

class SavingsSingleChartLayoutHandler extends ChartLayoutHandler {

    differenceValueHandler: ValueHandler;
    percentageValueHandler: ValueHandler;

    constructor( searchParams: SearchParamsType ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers: [ new SavingsValueHandler() ],        
            title: 'Water reserves (aggregated)',
            xLabel: timeRepr[ timeAggregation ],
            yLabel: valueRepr[ valueAggregation ] + ' (cubic meters)',
        } );

        this.differenceValueHandler = new SavingsDifferenceValueHandler();
        this.percentageValueHandler = new SavingsPercentageValueHandler();
    }
}

class SavingsStackChartLayoutHandler extends ChartLayoutHandler {

    constructor( searchParams: SearchParamsType ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers: [ 
                new ReservoirsValueHandler(), 
                new ReservoirsSumValueHandler() 
            ],
            title: 'Water reserves (per reservoir)',
            xLabel: timeRepr[ timeAggregation ],
            yLabel: valueRepr[ valueAggregation ] + ' (cubic meters)',
        } );
    }
}

export { 
    SavingsSingleChartLayoutHandler, 
    SavingsStackChartLayoutHandler
};
