import { ChartLayoutHandler } from "../_abstract";
import { ParamValues } from "@/logic/ParamValues";
import { timeRepr, valueRepr } from "@/logic/ValueHandler";
import { TimeValueHandler, SavingsChangeValueHandler } from "@/logic/ValueHandler/savings";
import { ProductionChangeValueHandler } from "@/logic/ValueHandler/production";
import { TemporalXTicksCalculator } from "../_abstract/xTicks";
import { YTicksCalculator } from "../_abstract/yTicks";

import type { SearchParamsType } from "@/types/searchParams";
import type { ObjectType } from "@/types";

class SavingsProductionMultiChartLayoutHandler extends ChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {

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
            dataBox: dataBox,
            XTicksCalculator: TemporalXTicksCalculator,
            YTicksCalculator,
        } );
    }
}

class SavingsProductionChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {
    
        switch ( dataBox.type ) {

            case 'standard': {
                this.handler = new SavingsProductionMultiChartLayoutHandler( searchParams, dataBox );
                break;
            }

            default:
                throw `Invalid type (${dataBox.type}) used in SavingsProductionChartLayoutHandlerFactory`;
        }
    }
}

export { 
    SavingsProductionChartLayoutHandlerFactory,
    SavingsProductionMultiChartLayoutHandler, 
};
