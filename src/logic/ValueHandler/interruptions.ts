import {
    ROSE, PINK, FUCHSIA, PURPLE, VIOLET,
    INDIGO, BLUE, SKY, CYAN, TEAL, EMERALD, 
    GREEN, LIME, YELLOW, AMBER, ORANGE, RED, 
    STONE, NEUTRAL, ZINC, GRAY, SLATE
} from '@/helpers/colors';

import { ValueHandler } from '.';
import { TimeValueHandler } from './savings';

// for temporal chart

class EventsValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'events', label: 'Events', unit: '', color: RED } );
    }
}

class EventsDifferenceValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'events_difference', label: 'Difference', unit: '' } );
    }
}

class EventsPercentageValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'events_percentage', label: 'Change', unit: '%' } );
    }
}

// for spatial chart

class MunicipalityIdValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'municipality_id', label: 'Municipality id', unit: '' } );
    }
}

class MunicipalityNameValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'name', label: 'Municipality', unit: '' } );
    }
}

class MunicipalityAreaValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'area', label: 'Area', unit: 'km2' } );
    }
}

class MunicipalityPopulationValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'population', label: 'Population', unit: '' } );
    }
}

class EventsOverAreaValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'events_over_area', label: 'Events over area', unit: '', color: RED } );
    }
}

class EventsOverPopulationValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'events_over_population', label: 'Events over population', unit: '', color: RED } );
    }
}

export { 
    TimeValueHandler, 
    EventsValueHandler, EventsDifferenceValueHandler, EventsPercentageValueHandler,
    MunicipalityIdValueHandler, MunicipalityNameValueHandler, MunicipalityAreaValueHandler, MunicipalityPopulationValueHandler,
    EventsOverAreaValueHandler, EventsOverPopulationValueHandler,
};
