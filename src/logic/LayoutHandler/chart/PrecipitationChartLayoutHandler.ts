import { ChartLayoutHandler, SingleChartLayoutHandler } from ".";
import { ParamValues } from "@/logic/ParamValues";

import { ValueHandler, timeRepr, valueRepr } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    PrecipitationValueHandler, PrecipitationDifferenceValueHandler, PrecipitationPercentageValueHandler,
    LocationsValueHandler, LocationsSumValueHandler,
} from "@/logic/ValueHandler/precipitation";

import type { SearchParamsType } from "@/types/searchParams";

class PrecipitationSingleChartLayoutHandler extends SingleChartLayoutHandler {

    constructor( searchParams: SearchParamsType ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers: [ new PrecipitationValueHandler() ],
               
            title: 'Precipitation measurements (aggregated)',
            xLabel: timeRepr[ timeAggregation ],
            yLabel: valueRepr[ valueAggregation ] + ' (mm)',

            yDifferenceValueHandlers: [ new PrecipitationDifferenceValueHandler() ],
            yPercentageValueHandlers: [ new PrecipitationPercentageValueHandler() ],
        } );
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
