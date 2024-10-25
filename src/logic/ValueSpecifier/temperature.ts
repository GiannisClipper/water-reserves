import { PrimaryValueSpecifier, DifferenceValueSpecifier, GrowthValueSpecifier, RatioValueSpecifier } from "@/logic/ValueSpecifier";

import type { PrimaryValueSpecifierType, SecondaryValueSpecifierType } from "@/logic/ValueSpecifier";

class TemperatureMinValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'weather', 
            key: 'temperature_min', 
            ...props 
        } );

    }
}

class TemperatureMeanValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'weather', 
            key: 'temperature_mean', 
            ...props 
        } );

    }
}

class TemperatureMaxValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'weather', 
            key: 'temperature_max', 
            ...props 
        } );

    }
}

class TemperatureMeanDifferenceValueSpecifier extends DifferenceValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'temperature_mean',
            key: 'temperature_mean_difference', 
            ...props 
        } );
    }
}

class TemperatureMeanGrowthValueSpecifier extends GrowthValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'temperature_mean',
            key: 'temperature_mean_percentage', 
            ...props 
        } );
    }
}

class TemperatureMeanRatioValueSpecifier extends RatioValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'temperature_mean',
            key: 'temperature_mean_ratio', 
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
