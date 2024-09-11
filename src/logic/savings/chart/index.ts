import type { ObjectType } from '@/types';

const _getYLimits = ( minValue: number, maxValue: number ): [ number, number ] => {

    const log: number = Math.floor( Math.log10( ( maxValue - minValue ) / 10 ) );
    const baseUnit: number = Math.pow( 10, log );
    return [
        Math.floor( minValue / baseUnit ) * baseUnit,
        Math.ceil( maxValue / baseUnit ) * baseUnit
    ]
}

const getYTicks = ( data: ObjectType[] ): number[] => {

    const minYValues = data.map( ( row: ObjectType ) => {
        const { time, total, ...quantities } = row;
        return Math.min( ...Object.values( quantities ) );
    } );

    const maxYValues = data.map( ( row: ObjectType ) => {
        const { time, total, ...quantities } = row;
        return total === undefined 
            ? Math.max( ...Object.values( quantities ) )
            : total;
    } );

    const [ minYValue, maxYValue ] = _getYLimits( 
        Math.min( ...minYValues ) * 1.10,
        Math.max( ...maxYValues ) * 1.05
    ); 

    const diff: number = ( maxYValue - minYValue ) * .5;
    const log: number = Math.floor( Math.log10( diff ) );
    const baseUnit: number = Math.pow( 10, log );

    let value = minYValue > baseUnit ? minYValue : 0;
    const result = [ value ];
    while ( value < maxYValue ) {
        value += baseUnit;
        result.push( value );
    }
    return result;
}

const getXTicks = ( data: ObjectType[] ): string[] => {

    let values = data.map( ( row: { [ key: string ]: any } ) => row.time );

    console.log('values.length', values.length, values);
    if ( values.length === 0 ) {
        return values;
    }

    // reduce days to months
    if ( values[ 0 ].length === 10 && values.length > 31 ) {
        values = values.filter( ( v: string ) => v.substring( 8, 10 ) === '01' );
        values = values.map( ( v: string ) => v.substring( 0, 8 ) );
    }

    // reduce days to years
    // if ( values[ 0 ].length === 10 && values.length > 24 ) {
    //         values = values.filter( ( v: string ) => v.substring( 5, 7 ) === '01' );
    // }

    // reduce months to years
    if ( values[ 0 ].length === 7 && values.length > 24 ) {
        values = values.filter( ( v: string ) => v.substring( 5, 7 ) === '01' );
    }

    return values;
}

export { 
    getYTicks, getXTicks
};