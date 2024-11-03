import { ObjectType } from "@/types"

interface ValueParserType {
    key?: string
}

interface PrimaryValueParserType extends ValueParserType {
    dataset?: string
    index: number
}

interface SecondaryValueParserType extends ValueParserType {
    sourceKey?: string
}

interface NestedValueParserType extends ValueParserType {
    nestedKey?: string
    nestedInnerKey?: string
}

abstract class ValueParser {

    key: string;

    constructor( { key }: ValueParserType ) {
        this.key = key || 'value'
    }

    parse( data: ObjectType[], legend: ObjectType | undefined ) {}

    toJSON(): ObjectType {
        return {
            key: this.key,
        }
    }
}

// promary values: get directly from the http response

abstract class PrimaryValueParser extends ValueParser {

    dataset: string | null;
    index: number;

    constructor( { dataset, index, ...otherProps }: PrimaryValueParserType ) {
        super( otherProps );
        this.dataset = dataset || null;
        this.index = index;
    }
}

// secondary values: calculated from primary values

abstract class SecondaryValueParser extends ValueParser {

    sourceKey: string;

    constructor( { sourceKey, ...otherProps }: SecondaryValueParserType ) {
        super( otherProps );
        this.sourceKey = sourceKey || 'value';
    }
}

// nested values: sub values of the same entity, eg. reservoirs, factories, locations
// helpful for the stack charts

abstract class NestedValueParser extends ValueParser {

    nestedKey: string;
    nestedInnerKey: string;

    constructor( { nestedKey, nestedInnerKey, ...otherProps }: NestedValueParserType ) {
        super( otherProps );
        this.nestedKey = nestedKey || 'key';
        this.nestedInnerKey = nestedInnerKey || 'value';
    }
}

abstract class DifferenceValueParser extends SecondaryValueParser {
    
    constructor( props: SecondaryValueParserType ) {
        super( props );
    }

    parse( data: ObjectType[], legend: ObjectType | undefined ) {
        for ( let i = data.length - 1; i >= 0; i-- ) {
            if ( i > 0 ) {
                data[ i ][ this.key ] =  data[ i ][ this.sourceKey ] - data[ i - 1 ][ this.sourceKey ];
            } else {
                data[ i ][ this.key ] = 0;
            }
        }
    }
}

abstract class GrowthValueParser extends SecondaryValueParser {
    
    constructor( props: SecondaryValueParserType ) {
        super( props );
    }

    parse( data: ObjectType[], legend: ObjectType | undefined ) {
        for ( let i = data.length - 1; i >= 0; i-- ) {
            if ( i > 0 ) {
                data[ i ][ this.key ] = Math.round( 
                    ( data[ i ][ this.sourceKey ] / data[ i - 1 ][ this.sourceKey ] - 1 ) * 100 * 10
                ) / 10;
            } else {
                data[ i ][ this.key ] = 0;
            }
        }
    }
}

abstract class RatioValueParser extends SecondaryValueParser {
    
    constructor( props: SecondaryValueParserType ) {
        super( props );
    }

    parse( data: ObjectType[], legend: ObjectType | undefined ) {
        const maxVal = Math.max( ...( data.map( x => x[ this.sourceKey ] ) ) );
        for ( let i = 0; i <= data.length - 1; i++ ) {
            data[ i ][ this.key ] /= maxVal; // normalize between 0..1
        }
    }
}

abstract class NestedSumValueParser extends SecondaryValueParser {
    
    constructor( props: SecondaryValueParserType ) {
        super( props );
    }

    parse( data: ObjectType[], legend: ObjectType | undefined ) {

        // an example for the row structure
        // {
        //     time: "2023",
        //     sum: 1014061531.5,
        //     reservoirs: {
        //         1: { reservoir_id: 1, savings: 45959895.89, percentage: 5 },
        //         2: { reservoir_id: 2, savings: 25926093.15, percentage: 3 },
        //         3: { reservoir_id: 3, savings: 562056767.12, percentage: 55 },
        //         4: { reservoir_id: 4, savings: 380118775.34, percentage: 37 },
        //     }
        // }

        // an example of this.sourceKey -> 'reservoirs.{reservoir_id}.savings',
        const [ sourceKey, nestedKey, nestedInnerKey ] = this.sourceKey.split( '.' );

        for ( let i = data.length - 1; i >= 0; i-- ) {
            const sum = Object.values( data[ i ][ sourceKey ] )
                .map( o => o[ nestedInnerKey ] )
                .reduce( ( a, b ) => a + b, 0 );
            data[ i ][ this.key ] =  sum;
        }
    }
}

abstract class NestedPercentageValueParser extends SecondaryValueParser {
    
    constructor( props: SecondaryValueParserType ) {
        super( props );
    }

    parse( data: ObjectType[], legend: ObjectType | undefined ) {
        // an example for the row structure
        // {
        //     time: "2023",
        //     sum: 1014061531.5,
        //     reservoirs: {
        //         1: { reservoir_id: 1, savings: 45959895.89, percentage: 5 },
        //         2: { reservoir_id: 2, savings: 25926093.15, percentage: 3 },
        //         3: { reservoir_id: 3, savings: 562056767.12, percentage: 55 },
        //         4: { reservoir_id: 4, savings: 380118775.34, percentage: 37 },
        //     }
        // }

        // an example of this.sourceKey -> 'reservoirs.{reservoir_id}.savings',
        const [ sourceKey, nestedKey, nestedInnerKey ] = this.sourceKey.split( '.' );

        for ( let i = data.length - 1; i >= 0; i-- ) {

            const sum: number = Object.values( data[ i ][ sourceKey ] )
                .map( o => o[ nestedInnerKey ] )
                .reduce( ( a, b ) => a + b, 0 );

            Object.values( data[ i ][ sourceKey ] )
                .forEach( o => { 
                    o[ this.key ] = Math.round( o[ nestedInnerKey ] / sum * 100 );
                } );
        }
    }
}

class TimeValueParser extends PrimaryValueParser {

    constructor( props: PrimaryValueParserType ) {
        super( { 
            key: 'time', 
            ...props 
        } );
    }
}

export type { 
    ValueParserType, PrimaryValueParserType, SecondaryValueParserType, 
    NestedValueParserType };

export {
    ValueParser, PrimaryValueParser, SecondaryValueParser,
    DifferenceValueParser, GrowthValueParser, RatioValueParser,
    NestedValueParser, NestedSumValueParser, NestedPercentageValueParser,
    TimeValueParser
}