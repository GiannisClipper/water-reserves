import {
    ROSE, PINK, FUCHSIA, PURPLE, VIOLET,
    INDIGO, BLUE, SKY, CYAN, TEAL, EMERALD, 
    GREEN, LIME, YELLOW, AMBER, ORANGE, RED, 
    STONE, NEUTRAL, ZINC, GRAY, SLATE
} from '@/helpers/colors';

import { ValueHandler } from '.';
import { TimeValueHandler } from './savings';

// for single chart

class PrecipitationValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'precipitation', label: 'Precipitation', unit: 'mm', color: TEAL } );
    }
}

class PrecipitationDifferenceValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'precipitation_difference', label: 'Difference', unit: 'mm' } );
    }
}

class PrecipitationPercentageValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'precipitation_percentage', label: 'Precipitation change', unit: '%', color: TEAL } );
    }
}

// for stack chart

class LocationsValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'precipitation.{id}.location', label: 'Precipitation', unit: 'mm', color: TEAL } );
    }
}

class LocationsSumValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'sum', label: 'Precipitation', unit: 'mm', color: TEAL } );
    }
}

export { 
    TimeValueHandler, 
    PrecipitationValueHandler, PrecipitationDifferenceValueHandler, PrecipitationPercentageValueHandler,
    LocationsValueHandler, LocationsSumValueHandler,
};
