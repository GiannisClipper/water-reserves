const calcTicks = ( values: number[], tickCount: number = 10 ): number[] => {

    const minYValue: number = Math.min( ...values ) * 0.90;
    const maxYValue: number = Math.max( ...values ) * 1.05;
    const difference: number = ( maxYValue - minYValue );
    // console.log( 'minYValue, maxYValue, difference', minYValue, maxYValue, difference )
    // for example: 0 1278834027 1278834027

    let log: number = Math.log10( difference );
    const logDecimals: number = log - Math.trunc( log );
    // console.log( 'log, logDecimals', log, logDecimals ) 
    // for example: 9.10681418338768 0.10681418338768012

    log = Math.trunc( log ) - ( logDecimals * 100000 < 69897 ? 1 : 0 );
    // log = log >= 1 ? log : 1;
    // console.log( 'log', log ) 
    // for example: 8

    let baseUnit: number = Math.pow( 10, log );
    let times = Math.ceil( Math.ceil( difference / baseUnit ) / tickCount ); // by default: /10
    times = Math.ceil( times / 2.5 ) * 2.5 // possible values: 2.5, 5, 7.5, 10
    // console.log( 'baseUnit, times', baseUnit, times ) 
    // for example: 100000000 2.5

    baseUnit *= times;

    let value = Math.floor( minYValue / baseUnit ) * baseUnit;
    const result = [ value ];
    while ( value <= maxYValue ) {
        value += baseUnit;
        result.push( value );
    }
    return result;
}

export { calcTicks };
