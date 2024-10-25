import { PrimaryValueSpecifier, DifferenceValueSpecifier, GrowthValueSpecifier, RatioValueSpecifier } from "@/logic/ValueSpecifier";

import { NestedValueSpecifier, NestedSumValueSpecifier, NestedPercentageValueSpecifier  } from "@/logic/ValueSpecifier";

import type { PrimaryValueSpecifierType, SecondaryValueSpecifierType, NestedValueSpecifierType } from "@/logic/ValueSpecifier";

class PrecipitationValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'weather', 
            key: 'precipitation', 
            ...props 
        } );

    }
}

class PrecipitationDifferenceValueSpecifier extends DifferenceValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'precipitation',
            key: 'precipitation_difference', 
            ...props 
        } );
    }
}

class PrecipitationGrowthValueSpecifier extends GrowthValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'precipitation',
            key: 'precipitation_percentage', 
            ...props 
        } );
    }
}

class PrecipitationRatioValueSpecifier extends RatioValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            sourceKey: 'precipitation',
            key: 'precipitation_ratio', 
            ...props 
        } );
    }
}

class LocationIdValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            dataset: 'weather',
            key: 'location_id', 
            ...props 
        } );
    }
}

class LocationsValueSpecifier extends NestedValueSpecifier {

    constructor( props: NestedValueSpecifierType ) {
        super( { 
            nestedKey: 'location_id',
            nestedInnerKey: 'precipitation',
            key: 'locations', 
            ...props 
        } );
    }
}

class LocationsSumValueSpecifier extends NestedSumValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            // only the 1st and 3rd parts will be used,
            // the {2nd} is just to make the structure more clear
            sourceKey: 'locations.{factory_id}.precipitation',
            key: 'sum', 
            ...props 
        } );
    }
}

class LocationsPercentageValueSpecifier extends NestedPercentageValueSpecifier {

    constructor( props: SecondaryValueSpecifierType ) {
        super( { 
            // only the 1st and 3rd parts will be used,
            // the {2nd} is just to make the structure more clear
            sourceKey: 'locations.{location_id}.precipitation',
            key: 'percentage', 
            ...props 
        } );
    }
}

export {
    PrecipitationValueSpecifier, 
    LocationIdValueSpecifier,
    PrecipitationDifferenceValueSpecifier, 
    PrecipitationGrowthValueSpecifier, 
    PrecipitationRatioValueSpecifier,     
    LocationsValueSpecifier, 
    LocationsSumValueSpecifier,
    LocationsPercentageValueSpecifier, 
}