import DataParser from "@/logic/DataParser";
import { ChartLayoutHandler, StackChartLayoutHandler, StandardChartLayoutHandler } from "../_abstract";
import { ParamValues } from "@/logic/ParamValues";

import { ValueHandler, timeRepr, valueRepr } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    PrecipitationValueHandler, PrecipitationDifferenceValueHandler, PrecipitationChangeValueHandler,
    LocationsValueHandler, LocationsSumValueHandler,
    LocationsPercentageValueHandler,
} from "@/logic/ValueHandler/precipitation";

import { TemporalXTicksCalculator } from "../_abstract/xTicks";
import { YTicksCalculator } from "../_abstract/yTicks";

import type { SearchParamsType } from "@/types/searchParams";

class PrecipitationStandardChartLayoutHandler extends StandardChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {

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
            data: dataParser.data,
            XTicksCalculator: TemporalXTicksCalculator,
            YTicksCalculator
        } );
    }
}

class PrecipitationStackChartLayoutHandler extends StackChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        // integrate legend values with data

        const yValueHandlers: ValueHandler[] = [];        
        const yPercentageValueHandlers: ValueHandler[] = [];

        if ( dataParser.legend ) {
            for ( const location of dataParser.legend.locations ) {

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
            data: dataParser.data,
            XTicksCalculator: TemporalXTicksCalculator,
            YTicksCalculator
        } );
    }
}

class PrecipitationChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {
    
        switch ( dataParser.type ) {

            case 'standard': {
                this.handler = new PrecipitationStandardChartLayoutHandler( searchParams, dataParser );
                break;
            }

            case 'stack': {
                this.handler = new PrecipitationStackChartLayoutHandler( searchParams, dataParser );
                break;
            }

            default:
                throw `Invalid type (${dataParser.type}) used in PrecipitationChartLayoutHandlerFactory`;
        }
    }
}

export { 
    PrecipitationChartLayoutHandlerFactory,
    PrecipitationStandardChartLayoutHandler,
    PrecipitationStackChartLayoutHandler,
};
