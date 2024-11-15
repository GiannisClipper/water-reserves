import { ChartLayoutHandler, StackChartLayoutHandler, StandardChartLayoutHandler } from "../_abstract";
import { ParamValues } from "@/logic/ParamValues";

import { ValueHandler, timeRepr, valueRepr } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    PrecipitationValueHandler, PrecipitationDifferenceValueHandler, PrecipitationChangeValueHandler,
    LocationsValueHandler, LocationsSumValueHandler,
    LocationsPercentageValueHandler,
} from "@/logic/ValueHandler/precipitation";

import { intervalRepr } from "@/logic/LayoutHandler";
import { TemporalXTicksCalculator } from "../_abstract/xTicks";
import { YTicksCalculator } from "../_abstract/yTicks";

import type { SearchParamsType } from "@/types/searchParams";
import type { ObjectType } from "@/types";

class PrecipitationStandardChartLayoutHandler extends StandardChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers: [ new PrecipitationValueHandler() ],
               
            title: 'Precipitation measurements' + intervalRepr( searchParams ),
            xLabel: timeRepr[ timeAggregation ],
            yLabel: valueRepr[ valueAggregation ] + ' (mm)',

            yDifferenceValueHandlers: [ new PrecipitationDifferenceValueHandler() ],
            yChangeValueHandlers: [ new PrecipitationChangeValueHandler() ],
            dataBox: dataBox,
            XTicksCalculator: TemporalXTicksCalculator,
            YTicksCalculator
        } );
    }
}

class PrecipitationStackChartLayoutHandler extends StackChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        // integrate legend values with data

        const yValueHandlers: ValueHandler[] = [];        
        const yPercentageValueHandlers: ValueHandler[] = [];

        if ( dataBox.legend ) {
            for ( const location of dataBox.legend.locations ) {

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
            title: 'Precipitation measurements' + intervalRepr( searchParams ),
            xLabel: timeRepr[ timeAggregation ],
            yLabel: valueRepr[ valueAggregation ] + ' (cubic meters)',
            yPercentageValueHandlers,
            dataBox: dataBox,
            XTicksCalculator: TemporalXTicksCalculator,
            YTicksCalculator
        } );
    }
}

class PrecipitationChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {
    
        switch ( dataBox.type ) {

            case 'standard': {
                this.handler = new PrecipitationStandardChartLayoutHandler( searchParams, dataBox );
                break;
            }

            case 'stack': {
                this.handler = new PrecipitationStackChartLayoutHandler( searchParams, dataBox );
                break;
            }

            default:
                throw `Invalid type (${dataBox.type}) used in PrecipitationChartLayoutHandlerFactory`;
        }
    }
}

export { 
    PrecipitationChartLayoutHandlerFactory,
    PrecipitationStandardChartLayoutHandler,
    PrecipitationStackChartLayoutHandler,
};
