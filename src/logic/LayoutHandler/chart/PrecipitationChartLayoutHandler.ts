import { ChartLayoutHandler } from ".";
import { ParamValues } from "@/logic/ParamValues";

import { ValueHandler, timeRepr, valueRepr } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    PrecipitationValueHandler, PrecipitationDifferenceValueHandler, PrecipitationPercentageValueHandler,
    LocationsValueHandler, LocationsSumValueHandler,
} from "@/logic/ValueHandler/precipitation";

import type { SearchParamsType } from "@/types/searchParams";

class PrecipitationSingleChartLayoutHandler extends ChartLayoutHandler {

    differenceValueHandler: ValueHandler;
    percentageValueHandler: ValueHandler;

    constructor( searchParams: SearchParamsType ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers: [ new PrecipitationValueHandler() ],
               
            title: 'Precipitation measurements (aggregated)',
            xLabel: timeRepr[ timeAggregation ],
            yLabel: valueRepr[ valueAggregation ] + ' (mm)',
        } );

        this.differenceValueHandler = new PrecipitationDifferenceValueHandler();
        this.percentageValueHandler = new PrecipitationPercentageValueHandler();
    }
}

class PrecipitationStackChartLayoutHandler extends ChartLayoutHandler {

    constructor( searchParams: SearchParamsType ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers: [ 
                new LocationsValueHandler(), 
                new LocationsSumValueHandler() 
            ],
            title: 'Precipitation measurements (per location)',
            xLabel: timeRepr[ timeAggregation ],
            yLabel: valueRepr[ valueAggregation ] + ' (cubic meters)',
        } );
    }
}

export { 
    PrecipitationSingleChartLayoutHandler,
    PrecipitationStackChartLayoutHandler,
};
