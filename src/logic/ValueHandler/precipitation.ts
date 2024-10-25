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

class PrecipitationChangeValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'precipitation_percentage', label: 'Precipitation change', unit: '%', color: TEAL } );
    }
}

// for stack chart

class LocationsValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'locations.{id}.precipitation', label: 'Precipitation', unit: 'mm', color: TEAL } );
    }
}

class LocationsPercentageValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'locations.{id}.percentage', label: 'Percentage', unit: '%' } );
    }
}

class LocationsSumValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'sum', label: 'Total', unit: 'mm', color: TEAL } );
    }
}

export { 
    TimeValueHandler, 
    PrecipitationValueHandler, PrecipitationDifferenceValueHandler, PrecipitationChangeValueHandler,
    LocationsValueHandler, LocationsPercentageValueHandler, LocationsSumValueHandler,
};
