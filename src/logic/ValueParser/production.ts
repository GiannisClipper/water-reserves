import { PrimaryValueParser, DifferenceValueParser, ChangeValueParser, RatioValueParser } from "@/logic/ValueParser";

import { NestedValueParser, NestedSumValueParser, NestedPercentageValueParser  } from "@/logic/ValueParser";

import type { PrimaryValueParserType, SecondaryValueParserType, NestedValueParserType } from "@/logic/ValueParser";
import type { ObjectType } from "@/types";

class ProductionValueParser extends PrimaryValueParser {

    constructor( props: PrimaryValueParserType ) {
        super( { 
            dataset: 'production', 
            key: 'production', 
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

class ProductionDifferenceValueParser extends DifferenceValueParser {

    constructor( props: SecondaryValueParserType ) {
        super( { 
            sourceKey: 'production', 
            key: 'production_difference', 
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

class ProductionChangeValueParser extends ChangeValueParser {

    constructor( props: SecondaryValueParserType ) {
        super( { 
            sourceKey: 'production', 
            key: 'production_percentage', 
            ...props 
        } );
    }
}

class ProductionRatioValueParser extends RatioValueParser {

    constructor( props: SecondaryValueParserType ) {
        super( { 
            sourceKey: 'production', 
            key: 'production_ratio', 
            ...props 
        } );
    }
}

class FactoryIdValueParser extends PrimaryValueParser {

    constructor( props: PrimaryValueParserType ) {
        super( { 
            dataset: 'production',
            key: 'factory_id', 
            ...props 
        } );
    }
}

class FactoriesValueParser extends NestedValueParser {

    constructor( props: NestedValueParserType ) {
        super( { 
            nestedKey: 'factory_id',
            nestedInnerKey: 'production',
            key: 'factories', 
            ...props 
        } );
    }
}

class FactoriesSumValueParser extends NestedSumValueParser {

    constructor( props: SecondaryValueParserType ) {
        super( { 
            // only the 1st and 3rd parts will be used,
            // the {2nd} is just to make the structure more clear
            sourceKey: 'factories.{factory_id}.production',
            key: 'sum', 
            ...props 
        } );
    }
}

class FactoriesPercentageValueParser extends NestedPercentageValueParser {

    constructor( props: SecondaryValueParserType ) {
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
    ProductionValueParser, 
    FactoryIdValueParser,
    ProductionDifferenceValueParser, 
    ProductionChangeValueParser, 
    ProductionRatioValueParser,     
    FactoriesValueParser, 
    FactoriesSumValueParser,
    FactoriesPercentageValueParser, 
}
