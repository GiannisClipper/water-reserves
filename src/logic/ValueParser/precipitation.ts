import { PrimaryValueParser, DifferenceValueParser, GrowthValueParser, RatioValueParser } from "@/logic/ValueParser";

import { NestedValueParser, NestedSumValueParser, NestedPercentageValueParser  } from "@/logic/ValueParser";

import type { PrimaryValueParserType, SecondaryValueParserType, NestedValueParserType } from "@/logic/ValueParser";

class PrecipitationValueParser extends PrimaryValueParser {

    constructor( props: PrimaryValueParserType ) {
        super( { 
            dataset: 'weather', 
            key: 'precipitation', 
            ...props 
        } );

    }
}

class PrecipitationDifferenceValueParser extends DifferenceValueParser {

    constructor( props: SecondaryValueParserType ) {
        super( { 
            sourceKey: 'precipitation',
            key: 'precipitation_difference', 
            ...props 
        } );
    }
}

class PrecipitationGrowthValueParser extends GrowthValueParser {

    constructor( props: SecondaryValueParserType ) {
        super( { 
            sourceKey: 'precipitation',
            key: 'precipitation_percentage', 
            ...props 
        } );
    }
}

class PrecipitationRatioValueParser extends RatioValueParser {

    constructor( props: SecondaryValueParserType ) {
        super( { 
            sourceKey: 'precipitation',
            key: 'precipitation_ratio', 
            ...props 
        } );
    }
}

class LocationIdValueParser extends PrimaryValueParser {

    constructor( props: PrimaryValueParserType ) {
        super( { 
            dataset: 'weather',
            key: 'location_id', 
            ...props 
        } );
    }
}

class LocationsValueParser extends NestedValueParser {

    constructor( props: NestedValueParserType ) {
        super( { 
            nestedKey: 'location_id',
            nestedInnerKey: 'precipitation',
            key: 'locations', 
            ...props 
        } );
    }
}

class LocationsSumValueParser extends NestedSumValueParser {

    constructor( props: SecondaryValueParserType ) {
        super( { 
            // only the 1st and 3rd parts will be used,
            // the {2nd} is just to make the structure more clear
            sourceKey: 'locations.{factory_id}.precipitation',
            key: 'sum', 
            ...props 
        } );
    }
}

class LocationsPercentageValueParser extends NestedPercentageValueParser {

    constructor( props: SecondaryValueParserType ) {
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
    PrecipitationValueParser, 
    LocationIdValueParser,
    PrecipitationDifferenceValueParser, 
    PrecipitationGrowthValueParser, 
    PrecipitationRatioValueParser,     
    LocationsValueParser, 
    LocationsSumValueParser,
    LocationsPercentageValueParser, 
}