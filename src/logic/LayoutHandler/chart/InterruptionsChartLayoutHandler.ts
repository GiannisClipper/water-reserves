import { ChartLayoutHandler, SingleChartLayoutHandler } from ".";
import { ParamValues } from "@/logic/ParamValues";

import { ValueHandler, timeRepr, valueRepr } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    EventsValueHandler, EventsDifferenceValueHandler, EventsPercentageValueHandler,
    MunicipalitiesValueHandler,
    EventsOverAreaValueHandler, EventsOverPopulationValueHandler 

} from "@/logic/ValueHandler/interruptions";

import type { SearchParamsType } from "@/types/searchParams";

class InterruptionsSingleChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( searchParams: SearchParamsType ) {
    
        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation } = params;

        if ( timeAggregation !== 'alltime ') {
            this.handler = new InterruptionsSingleTemporalChartLayoutHandler( searchParams );

        } else {
            this.handler = new InterruptionsSingleSpatialChartLayoutHandler( searchParams );
        }
    }
}

class InterruptionsSingleTemporalChartLayoutHandler extends SingleChartLayoutHandler {

    constructor( searchParams: SearchParamsType ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers: [ new EventsValueHandler() ],

            title: 'Water supply interruptions',
            xLabel: timeRepr[ timeAggregation ],
            yLabel: 'Events',

            yDifferenceValueHandlers: [ new EventsDifferenceValueHandler() ],
            yPercentageValueHandlers: [ new EventsPercentageValueHandler() ],
        } );
    }
}

class InterruptionsSingleSpatialChartLayoutHandler extends ChartLayoutHandler {

    constructor( searchParams: SearchParamsType ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        let title: string = 'Water supply interruptions';
        let yLabel: string = 'Events';
        let yValueHandlerClass = EventsValueHandler;

        if ( valueAggregation === 'sum,over-area' ) {
            title += ' (per sq. km)';
            yLabel += ' per sq. km';
            yValueHandlerClass = EventsOverAreaValueHandler

        } else if ( valueAggregation === 'sum,over-population' ) {
            title += ' (per 1000 residents)';
            yLabel += ' per 1000 residents';
            yValueHandlerClass = EventsOverPopulationValueHandler
        }

        super( {
            title: title,
            xLabel: 'Municipalities',
            yLabel: yLabel,
            xValueHandler: new MunicipalitiesValueHandler(),
            yValueHandlers: [ new yValueHandlerClass() ],
        } );
    }
}

export { 
    InterruptionsSingleChartLayoutHandlerFactory,
    InterruptionsSingleTemporalChartLayoutHandler,
    InterruptionsSingleSpatialChartLayoutHandler, 
};
