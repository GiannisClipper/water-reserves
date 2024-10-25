import DataHandler from "@/logic/DataHandler";
import { ChartLayoutHandler } from "..";
import { ParamValues } from "@/logic/ParamValues";

import { timeRepr } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    TemperatureMinValueHandler, TemperatureMeanValueHandler, TemperatureMaxValueHandler 
} from "@/logic/ValueHandler/temperature";

import type { SearchParamsType } from "@/types/searchParams";

class TemperatureMultiChartLayoutHandler extends ChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataHandler: DataHandler ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers: [ 
                new TemperatureMinValueHandler(), 
                new TemperatureMeanValueHandler(),
                new TemperatureMaxValueHandler()
            ],        
            title: 'Temperatures in Athens',
            xLabel: timeRepr[ timeAggregation ],
            yLabel: 'Celcius degrees',
            data: dataHandler.data,
        } );
    }
}

class TemperatureChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( searchParams: SearchParamsType, dataHandler: DataHandler ) {
    
        switch ( dataHandler.type ) {

            case 'multi': {
                this.handler = new TemperatureMultiChartLayoutHandler( searchParams, dataHandler );
                break;
            }

            default:
                throw `Invalid type (${dataHandler.type}) used in TemperatureChartLayoutHandlerFactory`;
        }
    }
}

export { 
    TemperatureChartLayoutHandlerFactory,
    TemperatureMultiChartLayoutHandler, 
};
