import DataHandler from "@/logic/DataHandler";
import { ChartLayoutHandler, SingleChartLayoutHandler, StackChartLayoutHandler } from ".";
import { ParamValues } from "@/logic/ParamValues";

import { ValueHandler, timeRepr, valueRepr } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    PrecipitationValueHandler, PrecipitationDifferenceValueHandler, PrecipitationChangeValueHandler,
    LocationsValueHandler, LocationsSumValueHandler,
    LocationsPercentageValueHandler,
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
            yChangeValueHandlers: [ new PrecipitationChangeValueHandler() ],
        } );
    }
}

class PrecipitationStackChartLayoutHandler extends StackChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataHandler: DataHandler ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        const yValueHandlers: ValueHandler[] = [];        
        const yPercentageValueHandlers: ValueHandler[] = [];        
        if ( dataHandler.legend ) {
            for ( const location of dataHandler.legend.locations ) {

                const yValueHandler = new LocationsValueHandler();
                yValueHandler.key = yValueHandler.key.replace( '{id}', location.id );
                yValueHandler.label = location.name_en;
                yValueHandlers.push( yValueHandler );

                const yPercentageValueHandler = new LocationsPercentageValueHandler();
                yPercentageValueHandler.key = yPercentageValueHandler.key.replace( '{id}', location.id );
                yPercentageValueHandlers.push( yPercentageValueHandler );
            }
            yValueHandlers.push( new LocationsSumValueHandler() );
        }

        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers,
            title: 'Precipitation measurements (per location)',
            xLabel: timeRepr[ timeAggregation ],
            yLabel: valueRepr[ valueAggregation ] + ' (cubic meters)',
            yPercentageValueHandlers,        
        } );
    }
}

export { 
    PrecipitationSingleChartLayoutHandler,
    PrecipitationStackChartLayoutHandler,
};
