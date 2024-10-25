import { ChartLayoutHandler } from "..";
import { ParamValues } from "@/logic/ParamValues";

import { timeRepr, valueRepr } from "@/logic/ValueHandler";

import { TimeValueHandler, SavingsChangeValueHandler } from "@/logic/ValueHandler/savings";
import { PrecipitationChangeValueHandler } from "@/logic/ValueHandler/precipitation";

import type { SearchParamsType } from "@/types/searchParams";
import DataHandler from "@/logic/DataHandler";

class SavingsPrecipitationMultiChartLayoutHandler extends ChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataHandler: DataHandler ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers: [ 
                new SavingsChangeValueHandler(), 
                new PrecipitationChangeValueHandler()
            ],        
            title: 'Water reserves & precipitation',
            xLabel: timeRepr[ timeAggregation ],
            yLabel: valueRepr[ valueAggregation ] + ' (growth %)',
            data: dataHandler.data,
        } );
    }
}

class SavingsPrecipitationChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( searchParams: SearchParamsType, dataHandler: DataHandler ) {
    
        switch ( dataHandler.type ) {

            case 'multi': {
                this.handler = new SavingsPrecipitationMultiChartLayoutHandler( searchParams, dataHandler );
                break;
            }

            default:
                throw `Invalid type (${dataHandler.type}) used in SavingsPrecipitationChartLayoutHandlerFactory`;
        }
    }
}

export { 
    SavingsPrecipitationChartLayoutHandlerFactory,
    SavingsPrecipitationMultiChartLayoutHandler, 
};
