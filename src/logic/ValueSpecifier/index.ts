import { ObjectType } from "@/types"
import type { UnitType } from '@/logic/MetadataHandler';

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

    defaultParser = ( ( val: any ): any => val )

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

    defaultParser = ( arr: ObjectType[] ): ObjectType[] => {
        for ( let i = arr.length - 1; i >= 0; i-- ) {
            if ( i > 0 ) {
                arr[ i ][ this.key ] =  arr[ i ][ this.sourceKey ] - arr[ i - 1 ][ this.sourceKey ];
            } else {
                arr[ i ][ this.key ] = 0;
            }
        }
        return arr;
    }
}

abstract class GrowthValueSpecifier extends SecondaryValueSpecifier {
    
    constructor( props: SecondaryValueSpecifierType ) {
        super( props );
        this.parser = props.parser || this.defaultParser;
    }

    defaultParser = ( arr: ObjectType[] ): ObjectType[] => {

        for ( let i = arr.length - 1; i >= 0; i-- ) {
            if ( i > 0 ) {
                arr[ i ][ this.key ] = Math.round( 
                    ( arr[ i ][ this.sourceKey ] / arr[ i - 1 ][ this.sourceKey ] - 1 ) * 100 
                );
            } else {
                arr[ i ][ this.key ] = 0;
            }
        }
        return arr;
    }
}

abstract class RatioValueSpecifier extends SecondaryValueSpecifier {
    
    constructor( props: SecondaryValueSpecifierType ) {
        super( props );
        this.parser = props.parser || this.defaultParser;
    }

    defaultParser = ( arr: ObjectType[] ): ObjectType[] => {
        const maxVal = Math.max( ...( arr.map( x => x[ this.sourceKey ] ) ) );
        for ( let i = 0; i <= arr.length - 1; i++ ) {
            arr[ i ][ this.key ] /= maxVal; // normalize between 0..1
        }
        return arr;
    }
}

abstract class NestedSumValueSpecifier extends SecondaryValueSpecifier {
    
    constructor( props: SecondaryValueSpecifierType ) {
        super( props );
        this.parser = props.parser || this.defaultParser;
    }

    defaultParser = ( arr: ObjectType[] ): ObjectType[] => {
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

        const [ sourceKey, nestedKey, nestedInnerKey ] = this.sourceKey.split( '.' );

        for ( let i = arr.length - 1; i >= 0; i-- ) {
            const sum = Object.values( arr[ i ][ sourceKey ] )
                .map( o => o[ nestedInnerKey ] )
                .reduce( ( a, b ) => a + b, 0 );
            arr[ i ][ this.key ] =  sum;
        }

        return arr;
    }
}

abstract class NestedPercentageValueSpecifier extends SecondaryValueSpecifier {
    
    constructor( props: SecondaryValueSpecifierType ) {
        super( props );
        this.parser = props.parser || this.defaultParser;
    }

    defaultParser = ( arr: ObjectType[] ): ObjectType[] => {
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

        const [ sourceKey, nestedKey, nestedInnerKey ] = this.sourceKey.split( '.' );

        for ( let i = arr.length - 1; i >= 0; i-- ) {

            const sum: number = Object.values( arr[ i ][ sourceKey ] )
                .map( o => o[ nestedInnerKey ] )
                .reduce( ( a, b ) => a + b, 0 );

            Object.values( arr[ i ][ sourceKey ] )
                .forEach( o => { 
                    o[ this.key ] = Math.round( o[ nestedInnerKey ] / sum * 100 );
                } );
        }
        return arr;
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

class ValueSpecifierCollection {

    _specifiers: ValueSpecifier[]

    constructor( specifiers: ValueSpecifier[] ) {
        this._specifiers = specifiers;
    }

    get specifiers(): ValueSpecifier[] {
        return this._specifiers
    }

    getPrimarySpecifiers(): PrimaryValueSpecifier[] {
        return this._specifiers.filter( s => s instanceof PrimaryValueSpecifier );
    }

    getSecondarySpecifiers(): SecondaryValueSpecifier[] {
        return this._specifiers.filter( s => s instanceof SecondaryValueSpecifier );
    }

    getNestedSpecifiers(): NestedValueSpecifier[] {
        return this._specifiers.filter( s => s instanceof NestedValueSpecifier );
    }

    getNotNestedSpecifiers(): ValueSpecifier[] {
        return this._specifiers.filter( s => ! ( s instanceof NestedValueSpecifier ) );
    }

    getByDataset( dataset?: string ): PrimaryValueSpecifier[] { 
        const filter: string | null = dataset || null;
        return  this.getPrimarySpecifiers().filter( s => s.dataset == dataset );
    }  

    getDatasets(): string[] {
        return Array.from( new Set( 
            this.getPrimarySpecifiers().filter( s => s.dataset ).map( s => s.dataset ) 
        ) ) as string[];
    }  

    getByAxeX(): ValueSpecifier[] {
        return this._specifiers.filter( s => s[ 'axeXY' ] === 'X' );
    }

    getByAxeY(): ValueSpecifier[] {
        return this._specifiers.filter( s => s[ 'axeXY' ] === 'Y' );
    }

    getNestedByAxeY(): NestedValueSpecifier[] {
        return this.getNestedSpecifiers().filter( s => s[ 'axeXY' ] === 'Y' );
    }

    getNotNestedByAxeY(): ValueSpecifier[] {
        return this.getNotNestedSpecifiers().filter( s => s[ 'axeXY' ] === 'Y' );
    }

    getByKey( key: string ): ValueSpecifier {
        return this._specifiers.filter( s => s[ 'key' ] === key )[ 0 ];
    }
}

export type { 
    ValueSpecifierType, PrimaryValueSpecifierType, SecondaryValueSpecifierType, 
    NestedValueSpecifierType, XYType };

export {
    ValueSpecifier, PrimaryValueSpecifier, SecondaryValueSpecifier,
    DifferenceValueSpecifier, GrowthValueSpecifier, RatioValueSpecifier,
    NestedValueSpecifier, NestedSumValueSpecifier, NestedPercentageValueSpecifier,
    TimeValueSpecifier,
    ValueSpecifierCollection,
}