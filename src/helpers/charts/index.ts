const getYLimits = ( minValue: number, maxValue: number ): [ number, number ] => {

    const log: number = Math.floor( Math.log10( minValue ) );
    const baseUnitase: number = Math.pow( 10, log );
    return [
        Math.floor( minValue / baseUnitase ) * baseUnitase,
        Math.ceil( maxValue / baseUnitase ) * baseUnitase
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

export { getYLimits, getYTicks };