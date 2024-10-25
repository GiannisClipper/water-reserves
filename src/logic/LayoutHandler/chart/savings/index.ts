import DataHandler from "@/logic/DataHandler";
import { ChartLayoutHandler, SingleChartLayoutHandler, StackChartLayoutHandler } from "..";
import { ParamValues } from "@/logic/ParamValues";

import { ValueHandler, timeRepr, valueRepr } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    SavingsValueHandler, SavingsDifferenceValueHandler, SavingsChangeValueHandler,
    ReservoirsValueHandler, ReservoirsSumValueHandler,
    ReservoirsPercentageValueHandler,
} from "@/logic/ValueHandler/savings";

import type { SearchParamsType } from "@/types/searchParams";

class SavingsSingleChartLayoutHandler extends SingleChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataHandler: DataHandler ) {

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
            data: dataHandler.data,    
        } );
    }
}

class SavingsStackChartLayoutHandler extends StackChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataHandler: DataHandler ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        // integrate legend values with data

        const yValueHandlers: ValueHandler[] = [];      
        const yPercentageValueHandlers: ValueHandler[] = [];  
        if ( dataHandler.legend ) {
            for ( const reservoir of dataHandler.legend.reservoirs ) {

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
            data: dataHandler.data,
        } );
    }
}

class SavingsChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( searchParams: SearchParamsType, dataHandler: DataHandler ) {
    
        switch ( dataHandler.type ) {

            case 'single': {
                this.handler = new SavingsSingleChartLayoutHandler( searchParams, dataHandler );
                break;
            }

            case 'stack': {
                this.handler = new SavingsStackChartLayoutHandler( searchParams, dataHandler );
                break;
            }

            default:
                throw `Invalid type (${dataHandler.type}) used in SavingsChartLayoutHandlerFactory`;
        }
    }
}

export { 
    SavingsChartLayoutHandlerFactory,
    SavingsSingleChartLayoutHandler, 
    SavingsStackChartLayoutHandler
};
