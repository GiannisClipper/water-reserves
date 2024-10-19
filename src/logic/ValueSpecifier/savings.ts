import { PrimaryValueSpecifier, DifferenceValueSpecifier, GrowthValueSpecifier, RatioValueSpecifier } from "@/logic/ValueSpecifier";

import { NestedValueSpecifier, NestedSumValueSpecifier, NestedPercentageValueSpecifier  } from "@/logic/ValueSpecifier";

import type { PrimaryValueSpecifierType, SecondaryValueSpecifierType, NestedValueSpecifierType } from "@/logic/ValueSpecifier";

class SavingsValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'savings', 
            key: 'savings', 
            label: 'Water reserves', 
            unit: 'm3', 
            ...props 
        } );
    }
}

class SavingsDifferenceValueSpecifier extends DifferenceValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'savings', 
            key: 'savings_difference', 
            label: 'Difference', 
            unit: 'm3', 
            ...props 
        } );
    }
}

class SavingsGrowthValueSpecifier extends GrowthValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'savings',
            key: 'savings_percentage', 
            label: 'Change', 
            unit: '%', 
            ...props 
        } );
    }
}

class SavingsRatioValueSpecifier extends RatioValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'savings',
            key: 'savings_ratio', 
            label: 'Ratio (0..1)', 
            ...props 
        } );
    }
}

class ReservoirIdValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'savings',
            key: 'reservoir_id', 
            label: 'Reservoir', 
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
            label: 'Reservoirs', 
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
            label: 'Reservoirs in total', 
            unit: 'm3', 
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
            label: 'Percentage', 
            unit: '%', 
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