import {
    ROSE, PINK, FUCHSIA, PURPLE, VIOLET,
    INDIGO, BLUE, SKY, CYAN, TEAL, EMERALD, 
    GREEN, LIME, YELLOW, AMBER, ORANGE, RED, 
    STONE, NEUTRAL, ZINC, GRAY, SLATE
} from '@/helpers/colors';

import { ValueHandler } from '.';
import { TimeValueHandler } from './savings';

// for single chart

class ProductionValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'production', label: 'Production', unit: 'm3', color: PINK } );
    }
}

class ProductionDifferenceValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'production_difference', label: 'Difference', unit: 'm3' } );
    }
}

class ProductionPercentageValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'production_percentage', label: 'Change', unit: '%', color: PINK } );
    }
}

// for stack chart

class FactoriesValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'factories.{id}.production', label: 'Production', unit: 'm3', color: PINK } );
    }
}

class FactoriesSumValueHandler extends ValueHandler {
    constructor() {
        super( { key: 'sum', label: 'Production', unit: 'm3', color: PINK } );
    }
}

export { 
    TimeValueHandler, 
    ProductionValueHandler, ProductionDifferenceValueHandler, ProductionPercentageValueHandler,
    FactoriesValueHandler, FactoriesSumValueHandler,
};
