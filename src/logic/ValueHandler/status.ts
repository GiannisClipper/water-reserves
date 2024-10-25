import {
    ROSE, PINK, FUCHSIA, PURPLE, VIOLET,
    INDIGO, BLUE, SKY, CYAN, TEAL, EMERALD, 
    GREEN, LIME, YELLOW, AMBER, ORANGE, RED, 
    STONE, NEUTRAL, ZINC, GRAY, SLATE
} from '@/helpers/colors';

import { ValueHandler } from '.';

class DateValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'date', label: 'Date' } );
    }
}

class SavingsValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'quantity', label: 'Reserves', unit: 'm3', color: SKY } );
    }
}

class ProductionValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'quantity', label: 'Production', unit: 'm3', color: PINK } );
    }
}

class PrecipitationValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'precipitation_sum', label: 'Precipitation', unit: 'm3', color: TEAL } );
    }
}

class MinTemperatureValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'temperature_2m_min', label: 'Min temp.', unit: 'oC', color: CYAN } );
    }
}

class MeanTemperatureValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'temperature_2m_mean', label: 'Mean temp.', unit: 'oC', color: YELLOW } );
    }
}

class MaxTemperatureValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'temperature_2m_max', label: 'Max temp.', unit: 'oC', color: ORANGE } );
    }
}

export { 
    DateValueHandler, 
    SavingsValueHandler, ProductionValueHandler, PrecipitationValueHandler,
    MinTemperatureValueHandler, MeanTemperatureValueHandler, MaxTemperatureValueHandler,
};
