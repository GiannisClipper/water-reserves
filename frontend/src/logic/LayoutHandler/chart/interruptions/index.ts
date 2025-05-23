import { ChartLayoutHandler, StandardChartLayoutHandler } from "../_abstract";
import { ParamValues } from "@/logic/ParamValues";

import { ValueHandler, timeRepr } from "@/logic/ValueHandler";

import { 
    TimeValueHandler,
    EventsValueHandler, EventsDifferenceValueHandler, EventsChangeValueHandler,
    NClustersValueHandler, ClusterValueHandler,
    MunicipalityIdValueHandler,
    EventsOverAreaValueHandler, EventsOverPopulationValueHandler, 
    MunicipalityNameValueHandler,
    MunicipalityAreaValueHandler,
    MunicipalityPopulationValueHandler
} from "@/logic/ValueHandler/interruptions";

import { intervalRepr } from "@/logic/LayoutHandler";
import { XTicksCalculator, TemporalXTicksCalculator } from "../_abstract/xTicks";
import { YTicksCalculator } from "../_abstract/yTicks";

import type { SearchParamsType } from "@/types/searchParams";
import type { ObjectType } from "@/types";

class TemporalInterruptionsStandardChartLayoutHandler extends StandardChartLayoutHandler {

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        super( {
            xValueHandler: new TimeValueHandler(),
            yValueHandlers: [ new EventsValueHandler() ],

            title: 'Water supply interruptions' + intervalRepr( searchParams ),
            xLabel: timeRepr[ timeAggregation ],
            yLabel: 'Events',

            yDifferenceValueHandlers: [ new EventsDifferenceValueHandler() ],
            yChangeValueHandlers: [ new EventsChangeValueHandler() ],
            dataBox: dataBox,
            XTicksCalculator: TemporalXTicksCalculator,
            YTicksCalculator,
        } );
    }
}

class SpatialInterruptionsStandardChartLayoutHandler extends ChartLayoutHandler {

    mapTitle: string;
    nameValueHandler: ValueHandler
    areaValueHandler: ValueHandler;
    populationValueHandler: ValueHandler;
    eventsValueHandler: ValueHandler;
    eventsOverAreaValueHandler: ValueHandler;
    eventsOverPopulationValueHandler: ValueHandler;
    nClustersValueHandler: ValueHandler;
    clusterValueHandler: ValueHandler;

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {

        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        let title: string = `Water supply interruptions (${searchParams.time_range})` + intervalRepr( searchParams );

        const [ frequency, computation, ratio ] = searchParams.time_aggregation.split(',');
        const over = ratio == 'over-population' ? 'over population' : 'over area';
        const mapTitle: string = `Water supply interruptions ${over} (${searchParams.time_range})` + intervalRepr( searchParams );

        let yLabel: string = 'Events';
        let yValueHandlerClass = EventsValueHandler;

        if ( valueAggregation === 'sum,over-area' ) {
            yLabel += ' per sq. km';
            yValueHandlerClass = EventsOverAreaValueHandler

        } else if ( valueAggregation === 'sum,over-population' ) {
            yLabel += ' per 1000 residents';
            yValueHandlerClass = EventsOverPopulationValueHandler
        }

        // sort the data

        const key = new yValueHandlerClass().key;
        dataBox.data.sort( ( a, b ) => b[ key ] - a[ key ] );
        console.log( key, dataBox.data )

        super( {
            title: title,
            xLabel: 'Municipalities',
            yLabel: yLabel,
            xValueHandler: new MunicipalityNameValueHandler(),
            yValueHandlers: [ new yValueHandlerClass() ],
            dataBox: dataBox,
            XTicksCalculator,
            YTicksCalculator
        } );

        this.mapTitle = mapTitle;
        this.nameValueHandler = new MunicipalityNameValueHandler();
        this.areaValueHandler = new MunicipalityAreaValueHandler();
        this.populationValueHandler = new MunicipalityPopulationValueHandler();
        this.eventsValueHandler = new EventsValueHandler();
        this.eventsOverAreaValueHandler = new EventsOverAreaValueHandler();
        this.eventsOverPopulationValueHandler = new EventsOverPopulationValueHandler();
        this.nClustersValueHandler = new NClustersValueHandler();
        this.clusterValueHandler = new ClusterValueHandler();
    }
}

class InterruptionsChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {
    
        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation } = params;

        if ( timeAggregation !== 'alltime' ) {
            this.handler = new TemporalInterruptionsStandardChartLayoutHandler( searchParams, dataBox );

        } else {
            this.handler = new SpatialInterruptionsStandardChartLayoutHandler( searchParams, dataBox );
        }
    }
}

export { 
    InterruptionsChartLayoutHandlerFactory,
    TemporalInterruptionsStandardChartLayoutHandler,
    SpatialInterruptionsStandardChartLayoutHandler, 
};
