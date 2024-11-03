import DataParser from "@/logic/DataParser";
import { ListLayoutHandler, StandardListLayoutHandler } from "../_abstract";

import { ValueHandler } from "@/logic/ValueHandler";

import { 
    TimeValueHandler, 
    EventsValueHandler, EventsDifferenceValueHandler, EventsChangeValueHandler,
    MunicipalityNameValueHandler, MunicipalityAreaValueHandler, MunicipalityPopulationValueHandler,
    EventsOverAreaValueHandler, EventsOverPopulationValueHandler,
} from "@/logic/ValueHandler/interruptions";

import { INTERRUPTIONS } from "@/app/settings";

import type { SearchParamsType } from "@/types/searchParams";
import ParamValues from "@/logic/ParamValues";

class TemporalInterruptionsStandardListLayoutHandler extends StandardListLayoutHandler {

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {

        super( {
            title: `${INTERRUPTIONS} (temporal)`,
            data: dataParser.data,
            valueHandlers: [
                new TimeValueHandler(),
                new EventsValueHandler(),
                new EventsDifferenceValueHandler(),
                new EventsChangeValueHandler(),
            ]
        } );
    }
}

class SpatialInterruptionsStandardListLayoutHandler extends StandardListLayoutHandler {

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {

        const data = dataParser.data.sort( ( a, b ) => a.name.localeCompare( b.name ) );

        super( {
            title: `${INTERRUPTIONS} (spatial)`,
            data,
            valueHandlers: [
                new MunicipalityNameValueHandler(),
                new EventsValueHandler(),
                new MunicipalityAreaValueHandler(),
                new EventsOverAreaValueHandler(),
                new MunicipalityPopulationValueHandler(),
                new EventsOverPopulationValueHandler()
            ],
        } );
    }
}

class InterruptionsListLayoutHandlerFactory {

    handler: ListLayoutHandler;

    constructor( searchParams: SearchParamsType, dataParser: DataParser ) {
    
        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation } = params;

        if ( timeAggregation !== 'alltime' ) {
            this.handler = new TemporalInterruptionsStandardListLayoutHandler( searchParams, dataParser );

        } else {
            this.handler = new SpatialInterruptionsStandardListLayoutHandler( searchParams, dataParser );
        }
    }
}

export { InterruptionsListLayoutHandlerFactory };
