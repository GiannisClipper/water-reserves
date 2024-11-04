import { ChartLayoutHandler } from "../_abstract";
import { ParamValues } from "@/logic/ParamValues";
import { timeRepr, valueRepr } from "@/logic/ValueHandler";
import { TimeValueHandler, SavingsChangeValueHandler } from "@/logic/ValueHandler/savings";
import { PrecipitationChangeValueHandler } from "@/logic/ValueHandler/precipitation";
import { TemporalXTicksCalculator } from "../_abstract/xTicks";
import { YTicksCalculator } from "../_abstract/yTicks";

import type { SearchParamsType } from "@/types/searchParams";
import type { ObjectType } from "@/types";

class SavingsPrecipitationMultiChartLayoutHandler extends ChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {

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
            data: dataBox.data,
            XTicksCalculator: TemporalXTicksCalculator,
            YTicksCalculator: YTicksCalculator
        } );
    }
}

class SavingsPrecipitationChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {
    
        switch ( dataBox.type ) {

            case 'standard': {
                this.handler = new SavingsPrecipitationMultiChartLayoutHandler( searchParams, dataBox );
                break;
            }

            default:
                throw `Invalid type (${dataBox.type}) used in SavingsPrecipitationChartLayoutHandlerFactory`;
        }
    }
}

export { 
    SavingsPrecipitationChartLayoutHandlerFactory,
    SavingsPrecipitationMultiChartLayoutHandler, 
};
