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
        super( { type: 'number', key: 'production', label: 'Production', unit: 'm3', color: PINK } );
    }
}

class ProductionDifferenceValueHandler extends ValueHandler {
    constructor() {
        super( { type: 'number', key: 'production_difference', label: 'Difference', unit: 'm3' } );
    }
}

class ProductionChangeValueHandler extends ValueHandler {
    constructor() {
        super( { type: 'number', key: 'production_percentage', label: 'Production change', unit: '%', color: PINK } );
    }
}

// for stack chart

class FactoriesValueHandler extends ValueHandler {
    constructor() {
        super( { type: 'number', key: 'factories.{id}.production', label: 'Production', unit: 'm3', color: PINK } );
    }
}

class FactoriesPercentageValueHandler extends ValueHandler {
    constructor() {
        super( { type: 'number', key: 'factories.{id}.percentage', label: 'Percentage', unit: '%' } );
    }
}

class FactoriesSumValueHandler extends ValueHandler {
    constructor() {
        super( { type: 'number', key: 'sum', label: 'Total', unit: 'm3', color: PINK } );
    }
}

export { 
    TimeValueHandler, 
    ProductionValueHandler, ProductionDifferenceValueHandler, ProductionChangeValueHandler,
    FactoriesValueHandler, FactoriesPercentageValueHandler, FactoriesSumValueHandler,
};
