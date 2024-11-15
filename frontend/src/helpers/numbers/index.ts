const withCommas = ( num: number ): string => {

    const isNegative = num < 0;
    const asStr: string = `${Math.abs( num )}`;
    const asArr: string[] = asStr.split( '.' ); 
    const intPart: string[] = asArr[ 0 ].split( '' ).reverse();

    const intPartWithCommas: string[] = [];
    for ( let i = 0; i < intPart.length; i++ ) {
        if ( i > 0 && i % 3 === 0 ) {
            intPartWithCommas.push( ',' );
        }
        intPartWithCommas.push( intPart[ i ] );
    }

    asArr[ 0 ] = intPartWithCommas.reverse().join( '' );
    const result: string = ( isNegative ? '-' : '' ) + asArr.join( '.' );

    return result;
}

const withPlusSign = ( num: number ): string =>
    num <= 0 ? `${num}` : `+${num}`;

export { withCommas, withPlusSign };

