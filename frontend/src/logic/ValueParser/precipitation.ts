import { PrimaryValueParser, DifferenceValueParser, ChangeValueParser, RatioValueParser } from "@/logic/ValueParser";

import { NestedValueParser, NestedSumValueParser, NestedPercentageValueParser  } from "@/logic/ValueParser";

import type { PrimaryValueParserType, SecondaryValueParserType, NestedValueParserType } from "@/logic/ValueParser";
import type { ObjectType } from "@/types";

class PrecipitationValueParser extends PrimaryValueParser {

    constructor( props: PrimaryValueParserType ) {
        super( { 
            dataset: 'weather', 
            key: 'precipitation', 
            ...props 
        } );
    }

    parse( data: ObjectType[], legend: ObjectType | undefined ) {
        super.parse( data, legend );
        for ( let i = data.length - 1; i >= 0; i-- ) {
            data[ i ][ this.key ] = Math.round( data[ i ][ this.key ] );
        }
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

    parse( data: ObjectType[], legend: ObjectType | undefined ) {
        super.parse( data, legend );
        for ( let i = data.length - 1; i >= 0; i-- ) {
            data[ i ][ this.key ] = Math.round( data[ i ][ this.key ] );
        }
    }    
}

class PrecipitationChangeValueParser extends ChangeValueParser {

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
    PrecipitationChangeValueParser, 
    PrecipitationRatioValueParser,     
    LocationsValueParser, 
    LocationsSumValueParser,
    LocationsPercentageValueParser, 
}