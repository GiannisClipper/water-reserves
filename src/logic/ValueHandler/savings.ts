import {
    ROSE, PINK, FUCHSIA, PURPLE, VIOLET,
    INDIGO, BLUE, SKY, CYAN, TEAL, EMERALD, 
    GREEN, LIME, YELLOW, AMBER, ORANGE, RED, 
    STONE, NEUTRAL, ZINC, GRAY, SLATE
} from '@/helpers/colors';

import { ValueHandler } from '.';

class TimeValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'time', label: 'Time' } );
    }
}

// for single chart

class SavingsValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'savings', label: 'Reserves', unit: 'm3', color: SKY } );
    }
}

class SavingsDifferenceValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'savings_difference', label: 'Difference', unit: 'm3' } );
    }
}

class SavingsPercentageValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'savings_percentage', label: 'Change', unit: '%', color: SKY } );
    }
}

// for stack chart

class ReservoirsValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'reservoirs.{id}.savings', label: 'Reserves', unit: 'm3', color: SKY } );
    }
}

class ReservoirsSumValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'sum', label: 'Reserves', unit: 'm3', color: SKY } );
    }
}

export { 
    TimeValueHandler, 
    SavingsValueHandler, SavingsDifferenceValueHandler, SavingsPercentageValueHandler,
    ReservoirsValueHandler, ReservoirsSumValueHandler
};
