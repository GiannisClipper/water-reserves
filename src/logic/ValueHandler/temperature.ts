import {
    ROSE, PINK, FUCHSIA, PURPLE, VIOLET,
    INDIGO, BLUE, SKY, CYAN, TEAL, EMERALD, 
    GREEN, LIME, YELLOW, AMBER, ORANGE, RED, 
    STONE, NEUTRAL, ZINC, GRAY, SLATE
} from '@/helpers/colors';

import { ValueHandler } from '.';
import { TimeValueHandler } from './savings';

// for multi chart

class TemperatureMinValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'temperature_min', label: 'Min', unit: 'oC', color: CYAN } );
    }
}
class TemperatureMeanValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'temperature_mean', label: 'Mean', unit: 'oC', color: YELLOW } );
    }
}
class TemperatureMaxValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'temperature_max', label: 'Max', unit: 'oC', color: ORANGE } );
    }
}

class TemperatureMinDifferenceValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'temperature_min_difference', label: 'Difference', unit: 'oC' } );
    }
}
class TemperatureMeanDifferenceValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'temperature_mean_difference', label: 'Difference', unit: 'oC' } );
    }
}
class TemperatureMaxDifferenceValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'temperature_max_difference', label: 'Difference', unit: 'oC' } );
    }
}

class TemperatureMinPercentageValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'temperature_min_percentage', label: 'Change', unit: '%' } );
    }
}
class TemperatureMeanPercentageValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'temperature_mean_percentage', label: 'Change', unit: '%' } );
    }
}
class TemperatureMaxPercentageValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'temperature_max_percentage', label: 'Change', unit: '%' } );
    }
}

export { 
    TimeValueHandler, 
    TemperatureMinValueHandler, TemperatureMinDifferenceValueHandler, TemperatureMinPercentageValueHandler,
    TemperatureMeanValueHandler, TemperatureMeanDifferenceValueHandler, TemperatureMeanPercentageValueHandler,
    TemperatureMaxValueHandler, TemperatureMaxDifferenceValueHandler, TemperatureMaxPercentageValueHandler,
};
