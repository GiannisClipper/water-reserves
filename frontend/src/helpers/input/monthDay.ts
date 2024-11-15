const isTypingMonthDay = ( value: string ): any => 

    value.length < 3 && value.match( /^\d{0,2}$/ )
    ||
    value.match( /^\d{0,2}-{1}\d{0,2}$/ );


const isMonth = ( value: string ): boolean => {

    const month = parseInt( value.substring( 0, 2 ) );

    if ( isNaN( month ) ) return false;

    if ( month < 1 || month > 12 ) return false;

    return true;
}

const isMonthDay = ( value: string ): boolean => {

    if ( ! isMonth( value ) ) return false;

    const month = parseInt( value.substring( 0, 2 ) );
    const sep1 = value.substring( 2, 3 );
    const day = parseInt( value.substring( 3, 5 ) );

    if ( sep1 !== '-' ) return false;

    if ( isNaN( day ) ) return false;

    if ( day < 1 || day > 31 ) return false;

    if ( [ 4, 6, 9, 11 ].includes( month ) && day === 31 ) return false;

    if ( month === 2 && day > 29 ) return false;

    return true;
}

export { isTypingMonthDay, isMonthDay };