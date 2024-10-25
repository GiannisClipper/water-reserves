import { PrimaryValueSpecifier, DifferenceValueSpecifier, GrowthValueSpecifier, RatioValueSpecifier } from "@/logic/ValueSpecifier";

import { NestedValueSpecifier, NestedSumValueSpecifier, NestedPercentageValueSpecifier  } from "@/logic/ValueSpecifier";

import type { PrimaryValueSpecifierType, SecondaryValueSpecifierType, NestedValueSpecifierType } from "@/logic/ValueSpecifier";

class SavingsValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'savings', 
            key: 'savings', 
            ...props 
        } );
    }
}

class SavingsDifferenceValueSpecifier extends DifferenceValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'savings', 
            key: 'savings_difference', 
            ...props 
        } );
    }
}

class SavingsGrowthValueSpecifier extends GrowthValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'savings',
            key: 'savings_percentage', 
            ...props 
        } );
    }
}

class SavingsRatioValueSpecifier extends RatioValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'savings',
            key: 'savings_ratio', 
            ...props 
        } );
    }
}

class ReservoirIdValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'savings',
            key: 'reservoir_id', 
            ...props 
        } );
    }
}

class ReservoirsValueSpecifier extends NestedValueSpecifier {

    constructor( props: NestedValueSpecifierType ) {
        super( { 
            nestedKey: 'reservoir_id',
            nestedInnerKey: 'savings',
            key: 'reservoirs', 
            ...props 
        } );
    }
}

class ReservoirsSumValueSpecifier extends NestedSumValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            // only the 1st and 3rd parts will be used,
            // the {2nd} is just to make the structure more clear
            sourceKey: 'reservoirs.{reservoir_id}.savings',
            key: 'sum', 
            ...props 
        } );
    }
}

class ReservoirsPercentageValueSpecifier extends NestedPercentageValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            // only the 1st and 3rd parts will be used,
            // the {2nd} is just to make the structure more clear
            sourceKey: 'reservoirs.{reservoir_id}.savings',
            key: 'percentage', 
            ...props 
        } );
    }
}

export {
    SavingsValueSpecifier, 
    ReservoirIdValueSpecifier,
    SavingsDifferenceValueSpecifier, 
    SavingsGrowthValueSpecifier, 
    SavingsRatioValueSpecifier,     
    ReservoirsValueSpecifier, 
    ReservoirsSumValueSpecifier,
    ReservoirsPercentageValueSpecifier, 
}