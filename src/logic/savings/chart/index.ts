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
        const { time, quantity, quantities } = row;
        if ( quantities !== undefined ) {
            return Math.min( ...Object.values( quantities ).map( q => q.quantity ) );
        }
        return quantity;
    } );

    const maxYValues = data.map( ( row: ObjectType ) => {
        const { time, quantity, total, quantities } = row;
        if ( total !== undefined ) {
            return total;
        }
        if ( quantities !== undefined ) {
            return Math.max( ...Object.values( quantities ).map( q => q.quantity ) );
        }
        return quantity;
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

    if ( values.length === 0 ) {
        return values;
    }

    switch ( values[ 0 ].length ) {

        case 10:
            // reduce days to months
            if ( values.length > 62 ) {
                values = values.filter( ( v: string ) => v.substring( 8, 10 ) === '01' );

                // reduce furthermore to years
                if ( values.length > 24 ) {
                        values = values.filter( ( v: string ) => v.substring( 5, 7 ) === '01' );
                }
            }

        case 7:
            // reduce months to years
            if ( values.length > 24 ) {
                values = values.filter( ( v: string ) => v.substring( 5, 7 ) === '01' );
            }
    }
    return values;
}

export { 
    getYTicks, getXTicks
};