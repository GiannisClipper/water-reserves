import { ObjectType } from "@/types"
import type { UnitType } from '@/types';

type XYType = 'X' | 'Y' | '';

interface ValueSpecifierType {
    key?: string
    parser?: CallableFunction
    label?: string
    unit?: UnitType
    axeXY?: XYType
}

interface PrimaryValueSpecifierType extends ValueSpecifierType {
    dataset?: string
    index: number
}

interface SecondaryValueSpecifierType extends ValueSpecifierType {
    sourceKey?: string
}

interface NestedValueSpecifierType extends ValueSpecifierType {
    nestedKey?: string
    nestedInnerKey?: string
}

abstract class ValueSpecifier {

    key: string;
    parser: CallableFunction;
    label: string;
    unit: UnitType;
    axeXY: XYType;

    constructor( { key, parser, label, unit, axeXY }: ValueSpecifierType ) {
        this.key = key || 'value'
        this.parser = parser || this.defaultParser
        this.label = label || '';
        this.unit = unit || '';
        this.axeXY = axeXY || '';
    }

    defaultParser = ( ( data: ObjectType[], legend: ObjectType | undefined ) => {} )

    toJSON(): ObjectType {
        return {
            key: this.key,
            label: this.label,
            unit: this.unit,
            axeXY: this.axeXY,
        }
    }
}

// promary values: get directly from the http response

abstract class PrimaryValueSpecifier extends ValueSpecifier {

    dataset: string | null;
    index: number;

    constructor( { dataset, index, ...otherProps }: PrimaryValueSpecifierType ) {
        super( otherProps );
        this.dataset = dataset || null;
        this.index = index;
    }
}

// secondary values: calculated from primary values

abstract class SecondaryValueSpecifier extends ValueSpecifier {

    sourceKey: string;

    constructor( { sourceKey, ...otherProps }: SecondaryValueSpecifierType ) {
        super( otherProps );
        this.sourceKey = sourceKey || 'value';
    }
}

// nested values: sub values of the same entity, eg. reservoirs, factories, locations
// helpful for the stack charts

abstract class NestedValueSpecifier extends ValueSpecifier {

    nestedKey: string;
    nestedInnerKey: string;

    constructor( { nestedKey, nestedInnerKey, ...otherProps }: NestedValueSpecifierType ) {
        super( otherProps );
        this.nestedKey = nestedKey || 'key';
        this.nestedInnerKey = nestedInnerKey || 'value';
    }
}

abstract class DifferenceValueSpecifier extends SecondaryValueSpecifier {
    
    constructor( props: SecondaryValueSpecifierType ) {
        super( props );
        this.parser = props.parser || this.defaultParser;
    }

    defaultParser = ( data: ObjectType[], legend: ObjectType | undefined ) => {

        for ( let i = data.length - 1; i >= 0; i-- ) {
            if ( i > 0 ) {
                data[ i ][ this.key ] =  data[ i ][ this.sourceKey ] - data[ i - 1 ][ this.sourceKey ];
            } else {
                data[ i ][ this.key ] = 0;
            }
        }
    }
}

abstract class GrowthValueSpecifier extends SecondaryValueSpecifier {
    
    constructor( props: SecondaryValueSpecifierType ) {
        super( props );
        this.parser = props.parser || this.defaultParser;
    }

    defaultParser = ( data: ObjectType[], legend: ObjectType | undefined ) => {

        for ( let i = data.length - 1; i >= 0; i-- ) {
            if ( i > 0 ) {
                data[ i ][ this.key ] = Math.round( 
                    ( data[ i ][ this.sourceKey ] / data[ i - 1 ][ this.sourceKey ] - 1 ) * 100 
                );
            } else {
                data[ i ][ this.key ] = 0;
            }
        }
    }
}

abstract class RatioValueSpecifier extends SecondaryValueSpecifier {
    
    constructor( props: SecondaryValueSpecifierType ) {
        super( props );
        this.parser = props.parser || this.defaultParser;
    }

    defaultParser = ( data: ObjectType[], legend: ObjectType | undefined ) => {

        const maxVal = Math.max( ...( data.map( x => x[ this.sourceKey ] ) ) );
        for ( let i = 0; i <= data.length - 1; i++ ) {
            data[ i ][ this.key ] /= maxVal; // normalize between 0..1
        }
    }
}

abstract class NestedSumValueSpecifier extends SecondaryValueSpecifier {
    
    constructor( props: SecondaryValueSpecifierType ) {
        super( props );
        this.parser = props.parser || this.defaultParser;
    }

    defaultParser = ( data: ObjectType[], legend: ObjectType | undefined ) => {

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

abstract class NestedPercentageValueSpecifier extends SecondaryValueSpecifier {
    
    constructor( props: SecondaryValueSpecifierType ) {
        super( props );
        this.parser = props.parser || this.defaultParser;
    }

    defaultParser = ( data: ObjectType[], legend: ObjectType | undefined ) => {

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

class TimeValueSpecifier extends PrimaryValueSpecifier {

    constructor( props: PrimaryValueSpecifierType ) {
        super( { 
            key: 'time', 
            label: 'Time', 
            ...props 
        } );
    }
}

export type { 
    ValueSpecifierType, PrimaryValueSpecifierType, SecondaryValueSpecifierType, 
    NestedValueSpecifierType, XYType };

export {
    ValueSpecifier, PrimaryValueSpecifier, SecondaryValueSpecifier,
    DifferenceValueSpecifier, GrowthValueSpecifier, RatioValueSpecifier,
    NestedValueSpecifier, NestedSumValueSpecifier, NestedPercentageValueSpecifier,
    TimeValueSpecifier
}