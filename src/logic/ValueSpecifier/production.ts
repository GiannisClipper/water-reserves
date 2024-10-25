import { PrimaryValueSpecifier, DifferenceValueSpecifier, GrowthValueSpecifier, RatioValueSpecifier } from "@/logic/ValueSpecifier";

import { NestedValueSpecifier, NestedSumValueSpecifier, NestedPercentageValueSpecifier  } from "@/logic/ValueSpecifier";

import type { PrimaryValueSpecifierType, SecondaryValueSpecifierType, NestedValueSpecifierType } from "@/logic/ValueSpecifier";

class ProductionValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'production', 
            key: 'production', 
            ...props 
        } );
    }
}

class ProductionDifferenceValueSpecifier extends DifferenceValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'production', 
            key: 'production_difference', 
            ...props 
        } );
    }
}
class ProductionGrowthValueSpecifier extends GrowthValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'production', 
            key: 'production_percentage', 
            ...props 
        } );
    }
}

class ProductionRatioValueSpecifier extends RatioValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'production', 
            key: 'production_ratio', 
            ...props 
        } );
    }
}

class FactoryIdValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'production',
            key: 'factory_id', 
            ...props 
        } );
    }
}

class FactoriesValueSpecifier extends NestedValueSpecifier {

    constructor( props: NestedValueSpecifierType ) {
        super( { 
            nestedKey: 'factory_id',
            nestedInnerKey: 'production',
            key: 'factories', 
            ...props 
        } );
    }
}

class FactoriesSumValueSpecifier extends NestedSumValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            // only the 1st and 3rd parts will be used,
            // the {2nd} is just to make the structure more clear
            sourceKey: 'factories.{factory_id}.production',
            key: 'sum', 
            ...props 
        } );
    }
}

class FactoriesPercentageValueSpecifier extends NestedPercentageValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            // only the 1st and 3rd parts will be used,
            // the {2nd} is just to make the structure more clear
            sourceKey: 'factories.{factory_id}.production',
            key: 'percentage', 
            ...props 
        } );
    }
}

export {
    ProductionValueSpecifier, 
    FactoryIdValueSpecifier,
    ProductionDifferenceValueSpecifier, 
    ProductionGrowthValueSpecifier, 
    ProductionRatioValueSpecifier,     
    FactoriesValueSpecifier, 
    FactoriesSumValueSpecifier,
    FactoriesPercentageValueSpecifier, 
}
