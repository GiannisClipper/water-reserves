import { PrimaryValueSpecifier, DifferenceValueSpecifier, GrowthValueSpecifier, RatioValueSpecifier } from "@/logic/ValueSpecifier";

import type { PrimaryValueSpecifierType, SecondaryValueSpecifierType } from "@/logic/ValueSpecifier";

class TemperatureMinValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'weather', 
            key: 'temperature_min', 
            label: 'Ελάχιστη', 
            unit: 'oC', 
            ...props 
        } );

    }
}

class TemperatureMeanValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'weather', 
            key: 'temperature_mean', 
            label: 'Μέση', 
            unit: 'oC', 
            ...props 
        } );

    }
}

class TemperatureMaxValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'weather', 
            key: 'temperature_max', 
            label: 'Μέγιστη', 
            unit: 'oC', 
            ...props 
        } );

    }
}

class TemperatureMeanDifferenceValueSpecifier extends DifferenceValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'temperature_mean',
            key: 'temperature_mean_difference', 
            label: 'Διαφορά', 
            unit: 'oC', 
            ...props 
        } );
    }
}

class TemperatureMeanGrowthValueSpecifier extends GrowthValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'temperature_mean',
            key: 'temperature_mean_percentage', 
            label: 'Μεταβολή', 
            unit: '%', 
            ...props 
        } );
    }
}

class TemperatureMeanRatioValueSpecifier extends RatioValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'temperature_mean',
            key: 'temperature_mean_ratio', 
            label: 'Αναλογία (0..1)', 
            ...props 
        } );
    }
}

export {
    TemperatureMinValueSpecifier, 
    TemperatureMeanValueSpecifier, 
    TemperatureMaxValueSpecifier, 
    TemperatureMeanDifferenceValueSpecifier, 
    TemperatureMeanGrowthValueSpecifier, 
    TemperatureMeanRatioValueSpecifier,     
}
