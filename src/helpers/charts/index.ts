const getYLimits = ( minValue: number, maxValue: number ): [ number, number ] => {

    const log: number = Math.floor( Math.log10( minValue ) );
    const baseUnit: number = Math.pow( 10, log );
    return [
        Math.floor( minValue / baseUnit ) * baseUnit,
        Math.ceil( maxValue / baseUnit ) * baseUnit
    ]
}

const getYTicks = ( minValue: number, maxValue: number ): number[] => {

    const [ minYValue, maxYValue ] = getYLimits( minValue, maxValue ); 
    const diff: number = ( maxYValue - minYValue ) * .5;
    const log: number = Math.floor( Math.log10( diff ) );
    const baseUnit: number = Math.pow( 10, log );

    let value = minYValue > baseUnit ? minYValue : 0;
    const result = [ value ];
    while ( value < maxValue ) {
        value += baseUnit;
        result.push( value );
    }
    return result;
}

const getXTicks = ( values: string[] ): string[] => {

    console.log('values.length', values.length);
    if ( values.length === 0 ) {
        return values;
    }

    // reduce days to months
    if ( values[ 0 ].length === 10 && values.length > 31 ) {
        values = values.filter( ( v: string ) => v.substring( 8, 10 ) === '01' );
    }

    // reduce days to years
    if ( values[ 0 ].length === 10 && values.length > 24 ) {
        values = values.filter( ( v: string ) => v.substring( 5, 7 ) === '01' );
    }

    // reduce months to years
    if ( values[ 0 ].length === 7 && values.length > 24 ) {
        values = values.filter( ( v: string ) => v.substring( 5, 7 ) === '01' );
    }

    return values;
}

export { getYLimits, getYTicks, getXTicks };