import DataParser from "@/logic/DataParser";
import { ChartLayoutHandler, StandardChartLayoutHandler } from "../_abstract";
import { ParamValues } from "@/logic/ParamValues";

import { ValueHandler, timeRepr } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    EventsValueHandler, EventsDifferenceValueHandler, EventsChangeValueHandler,
    MunicipalityIdValueHandler,
    EventsOverAreaValueHandler, EventsOverPopulationValueHandler, 
    MunicipalityNameValueHandler,
    MunicipalityAreaValueHandler,
    MunicipalityPopulationValueHandler

} from "@/logic/ValueHandler/interruptions";

import type { SearchParamsType } from "@/types/searchParams";

import { XTicksCalculator, TemporalXTicksCalculator } from "../_abstract/xTicks";
import { YTicksCalculator } from "../_abstract/yTicks";

class TemporalInterruptionsStandardChartLayoutHandler extends StandardChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers: [ new EventsValueHandler() ],

            title: 'Water supply interruptions',
            xLabel: timeRepr[ timeAggregation ],
            yLabel: 'Events',

            yDifferenceValueHandlers: [ new EventsDifferenceValueHandler() ],
            yChangeValueHandlers: [ new EventsChangeValueHandler() ],
            data: dataParser.data,
            XTicksCalculator: TemporalXTicksCalculator,
            YTicksCalculator,
        } );
    }
}

class SpatialInterruptionsStandardChartLayoutHandler extends ChartLayoutHandler {

    nameValueHandler: ValueHandler
    areaValueHandler: ValueHandler;
    populationValueHandler: ValueHandler;
    eventsValueHandler: ValueHandler;
    eventsOverAreaValueHandler: ValueHandler;
    eventsOverPopulationValueHandler: ValueHandler;

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {

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

        // sort the data

        const key = new yValueHandlerClass().key;
        dataParser.data.sort( ( a, b ) => b[ key ] - a[ key ] );
        console.log( key, dataParser.data )

        super( {
            title: title,
            xLabel: 'Municipalities',
            yLabel: yLabel,
            xValueHandler: new MunicipalityNameValueHandler(),
            yValueHandlers: [ new yValueHandlerClass() ],
            data: dataParser.data,
            XTicksCalculator,
            YTicksCalculator
        } );

        this.nameValueHandler = new MunicipalityNameValueHandler();
        this.areaValueHandler = new MunicipalityAreaValueHandler();
        this.populationValueHandler = new MunicipalityPopulationValueHandler();
        this.eventsValueHandler = new EventsValueHandler();
        this.eventsOverAreaValueHandler = new EventsOverAreaValueHandler();
        this.eventsOverPopulationValueHandler = new EventsOverPopulationValueHandler();
    }
}

class InterruptionsChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {
    
        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation } = params;

        if ( timeAggregation !== 'alltime' ) {
            this.handler = new TemporalInterruptionsStandardChartLayoutHandler( searchParams, dataParser );

        } else {
            this.handler = new SpatialInterruptionsStandardChartLayoutHandler( searchParams, dataParser );
        }
    }
}

export { 
    InterruptionsChartLayoutHandlerFactory,
    TemporalInterruptionsStandardChartLayoutHandler,
    SpatialInterruptionsStandardChartLayoutHandler, 
};
