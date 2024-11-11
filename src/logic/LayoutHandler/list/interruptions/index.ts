import { ListLayoutHandler, StandardListLayoutHandler } from "../_abstract";

import { 
    TimeValueHandler, 
    EventsValueHandler, EventsDifferenceValueHandler, EventsChangeValueHandler,
    MunicipalityNameValueHandler, MunicipalityAreaValueHandler, MunicipalityPopulationValueHandler,
    EventsOverAreaValueHandler, EventsOverPopulationValueHandler,
} from "@/logic/ValueHandler/interruptions";

import { INTERRUPTIONS } from "@/app/settings";
import { intervalRepr } from "@/logic/LayoutHandler";

import type { SearchParamsType } from "@/types/searchParams";
import ParamValues from "@/logic/ParamValues";
import { ObjectType } from "@/types";

class TemporalInterruptionsStandardListLayoutHandler extends StandardListLayoutHandler {

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {

        super( {
            title: INTERRUPTIONS + intervalRepr( searchParams ),
            data: dataBox.data,
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

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {

        const data = dataBox.data.sort( ( a, b ) => a.name.localeCompare( b.name ) );

        super( {
            title: INTERRUPTIONS + intervalRepr( searchParams ),
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

    constructor( searchParams: SearchParamsType, dataBox: ObjectType ) {
    
        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation } = params;

        if ( timeAggregation !== 'alltime' ) {
            this.handler = new TemporalInterruptionsStandardListLayoutHandler( searchParams, dataBox );

        } else {
            this.handler = new SpatialInterruptionsStandardListLayoutHandler( searchParams, dataBox );
        }
    }
}

export { InterruptionsListLayoutHandlerFactory };
