import { PrimaryValueSpecifier, DifferenceValueSpecifier, GrowthValueSpecifier, RatioValueSpecifier } from "@/logic/ValueSpecifier";

import type { PrimaryValueSpecifierType, SecondaryValueSpecifierType } from "@/logic/ValueSpecifier";

class TemperatureMinValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'weather', 
            key: 'temperature_min', 
            label: 'Min', 
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
            label: 'Mean', 
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
            label: 'Max', 
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
            label: 'Difference', 
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
            label: 'Change', 
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
            label: 'Ratio (0..1)', 
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
