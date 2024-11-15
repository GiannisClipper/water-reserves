import { PrimaryValueParser, SecondaryValueParser, DifferenceValueParser, ChangeValueParser, RatioValueParser } from "@/logic/ValueParser";

import { NestedValueParser, NestedSumValueParser, NestedPercentageValueParser  } from "@/logic/ValueParser";

import type { PrimaryValueParserType, SecondaryValueParserType, NestedValueParserType } from "@/logic/ValueParser";
import { ObjectType } from "@/types";

class SavingsValueParser extends PrimaryValueParser {

    constructor( props: PrimaryValueParserType ) {
        super( { 
            dataset: 'savings', 
            key: 'savings', 
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

class SavingsDifferenceValueParser extends DifferenceValueParser {

    constructor( props: SecondaryValueParserType ) {
        super( { 
            sourceKey: 'savings', 
            key: 'savings_difference', 
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

class SavingsChangeValueParser extends ChangeValueParser {

    constructor( props: SecondaryValueParserType ) {
        super( { 
            sourceKey: 'savings',
            key: 'savings_percentage', 
            ...props 
        } );
    }
}

class SavingsRatioValueParser extends RatioValueParser {

    constructor( props: SecondaryValueParserType ) {
        super( { 
            sourceKey: 'savings',
            key: 'savings_ratio', 
            ...props 
        } );
    }
}

class ReservoirIdValueParser extends PrimaryValueParser {

    constructor( props: PrimaryValueParserType ) {
        super( { 
            dataset: 'savings',
            key: 'reservoir_id', 
            ...props 
        } );
    }
}

class ReservoirsValueParser extends NestedValueParser {

    constructor( props: NestedValueParserType ) {
        super( { 
            key: 'reservoirs', 
            nestedKey: 'reservoir_id',
            nestedInnerKey: 'savings',
            ...props 
        } );
    }
}

class ReservoirsSumValueParser extends NestedSumValueParser {

    constructor( props: SecondaryValueParserType ) {
        super( { 
            // only the 1st and 3rd parts will be used,
            // the {2nd} is just to make the structure more clear
            sourceKey: 'reservoirs.{reservoir_id}.savings',
            key: 'sum', 
            ...props 
        } );
    }
}

class ReservoirsPercentageValueParser extends NestedPercentageValueParser {

    constructor( props: SecondaryValueParserType ) {
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
    SavingsValueParser, 
    ReservoirIdValueParser,
    SavingsDifferenceValueParser, 
    SavingsChangeValueParser, 
    SavingsRatioValueParser,     
    ReservoirsValueParser, 
    ReservoirsSumValueParser,
    ReservoirsPercentageValueParser,
}