import { ChartLayoutHandler, StackChartLayoutHandler, StandardChartLayoutHandler } from "../_abstract";
import { ParamValues } from "@/logic/ParamValues";

import { ValueHandler, timeRepr, valueRepr } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    SavingsValueHandler, SavingsDifferenceValueHandler, SavingsChangeValueHandler,
    ReservoirsValueHandler, ReservoirsSumValueHandler,
    ReservoirsPercentageValueHandler,
} from "@/logic/ValueHandler/savings";

import { TemporalXTicksCalculator } from "../_abstract/xTicks";
import { YTicksCalculator } from "../_abstract/yTicks";

import type { SearchParamsType } from "@/types/searchParams";
import type { ObjectType } from "@/types";

class SavingsStandardChartLayoutHandler extends StandardChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers: [ new SavingsValueHandler() ],        
            title: 'Water reserves (aggregated)',
            xLabel: timeRepr[ timeAggregation ],
            yLabel: valueRepr[ valueAggregation ] + ' (cubic meters)',
            yDifferenceValueHandlers: [ new SavingsDifferenceValueHandler() ],        
            yChangeValueHandlers: [ new SavingsChangeValueHandler() ],    
            data: dataBox.data,
            XTicksCalculator: TemporalXTicksCalculator, 
            YTicksCalculator,
        } );
    }
}

class SavingsStackChartLayoutHandler extends StackChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        // integrate legend values with data

        const yValueHandlers: ValueHandler[] = [];      
        const yPercentageValueHandlers: ValueHandler[] = [];  
        if ( dataBox.legend ) {
            for ( const reservoir of dataBox.legend.reservoirs ) {

                const yValueHandler = new ReservoirsValueHandler();
                yValueHandler.key = yValueHandler.key.replace( '{id}', reservoir.id );
                yValueHandler.label = reservoir.name_en;
                yValueHandlers.push( yValueHandler );

                const yPercentageValueHandler = new ReservoirsPercentageValueHandler();
                yPercentageValueHandler.key = yPercentageValueHandler.key.replace( '{id}', reservoir.id );
                yPercentageValueHandlers.push( yPercentageValueHandler );
            }
            yValueHandlers.push( new ReservoirsSumValueHandler() );
        }
    
        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers,
            title: 'Water reserves (per reservoir)',
            xLabel: timeRepr[ timeAggregation ],
            yLabel: valueRepr[ valueAggregation ] + ' (cubic meters)',
            yPercentageValueHandlers,
            data: dataBox.data,
            XTicksCalculator: TemporalXTicksCalculator, 
            YTicksCalculator,
        } );
    }
}

class SavingsChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {
    
        switch ( dataBox.type ) {

            case 'standard': {
                this.handler = new SavingsStandardChartLayoutHandler( searchParams, dataBox );
                break;
            }

            case 'stack': {
                this.handler = new SavingsStackChartLayoutHandler( searchParams, dataBox );
                break;
            }

            default:
                throw `Invalid type (${dataBox.type}) used in SavingsChartLayoutHandlerFactory`;
        }
    }
}

export { 
    SavingsChartLayoutHandlerFactory,
    SavingsStandardChartLayoutHandler, 
    SavingsStackChartLayoutHandler
};
