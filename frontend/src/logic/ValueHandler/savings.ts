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
        super( { type: 'number', key: 'savings', label: 'Reserves', unit: 'm3', color: SKY } );
    }
}

class SavingsDifferenceValueHandler extends ValueHandler {
    constructor() {
        super( { type: 'number', key: 'savings_difference', label: 'Difference', unit: 'm3' } );
    }
}

class SavingsChangeValueHandler extends ValueHandler {
    constructor() {
        super( { type: 'number', key: 'savings_percentage', label: 'Percentage of change', unit: '%', color: SKY } );
    }
}

// for stack chart

class ReservoirsValueHandler extends ValueHandler {
    constructor() {
        super( { type: 'number', key: 'reservoirs.{id}.savings', label: 'Reserves', unit: 'm3', color: SKY } );
    }
}

class ReservoirsPercentageValueHandler extends ValueHandler {
    constructor() {
        super( { type: 'number', key: 'reservoirs.{id}.percentage', label: 'Percentage', unit: '%' } );
    }
}

class ReservoirsSumValueHandler extends ValueHandler {
    constructor() {
        super( { type: 'number', key: 'sum', label: 'Total', unit: 'm3', color: SKY } );
    }
}

// class ReservoirsNameValueHandler extends ValueHandler {
//     constructor() {
//         super( { key: 'reservoirs.{id}.name', label: 'Reservoir' } );
//     }
// }

export { 
    TimeValueHandler, 
    SavingsValueHandler, SavingsDifferenceValueHandler, SavingsChangeValueHandler,
    ReservoirsValueHandler, ReservoirsPercentageValueHandler, ReservoirsSumValueHandler,
    // ReservoirsNameValueHandler
};
