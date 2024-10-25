import { ChartLayoutHandler } from "..";
import { ParamValues } from "@/logic/ParamValues";

import { timeRepr, valueRepr } from "@/logic/ValueHandler";

import { TimeValueHandler, SavingsChangeValueHandler } from "@/logic/ValueHandler/savings";
import { ProductionChangeValueHandler } from "@/logic/ValueHandler/production";

import type { SearchParamsType } from "@/types/searchParams";
import DataHandler from "@/logic/DataHandler";

class SavingsProductionMultiChartLayoutHandler extends ChartLayoutHandler {

    constructor( searchParams: SearchParamsType ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers: [ 
                new SavingsChangeValueHandler(), 
                new ProductionChangeValueHandler()
            ],        
            title: 'Water reserves & drinking water production',
            xLabel: timeRepr[ timeAggregation ],
            yLabel: valueRepr[ valueAggregation ] + ' (growth %)',
        } );
    }
}

class SavingsProductionChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( searchParams: SearchParamsType, dataHandler: DataHandler ) {
    
        switch ( dataHandler.type ) {

            case 'multi': {
                this.handler = new SavingsProductionMultiChartLayoutHandler( searchParams );
                break;
            }

            default:
                throw `Invalid type (${dataHandler.type}) used in SavingsProductionChartLayoutHandlerFactory`;
        }
    }
}

export { 
    SavingsProductionChartLayoutHandlerFactory,
    SavingsProductionMultiChartLayoutHandler, 
};
