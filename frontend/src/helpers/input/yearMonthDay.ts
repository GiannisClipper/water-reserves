const isTypingYearMonthDay = ( value: string ): any => 

    value.length < 5 && value.match( /^\d{0,4}$/ )
    ||
    value.length < 8 && value.match( /^\d{0,4}-{1}\d{0,2}$/ )
    ||
    value.match( /^\d{0,4}-{1}\d{0,2}-{1}\d{0,2}$/ );


const isLeap = ( year: number ): boolean =>

    year % 4 === 0 && ( year % 100 !== 0 || year % 400 === 0 );


const isYear = ( value: string ): boolean => {

    const year = parseInt( value.substring( 0, 4 ) );

    if ( isNaN( year ) ) return false;

    if ( year < 1900 || year > 2099 ) return false;

    return true;
}

const isYearMonth = ( value: string ): boolean => {

    if ( ! isYear( value ) ) return false;

    if ( value.length < 5 ) return true;

    const sep1 = value.substring( 4, 5 );
    const month = parseInt( value.substring( 5, 7 ) );

    if ( sep1 !== '-' ) return false;

    if ( isNaN( month ) ) return false;

    if ( month < 1 || month > 12 ) return false;

    return true;
}

const isYearMonthDay = ( value: string ): boolean => {

    if ( ! isYearMonth( value ) ) return false;

    if ( value.length < 8 ) return true;

    const year = parseInt( value.substring( 0, 4 ) );
    const sep2 = value.substring( 7, 8 );
    const month = parseInt( value.substring( 5, 7 ) );
    const day = parseInt( value.substring( 8, 10 ) );

    if ( sep2 !== '-' ) return false;

    if ( isNaN( day ) ) return false;

    if ( day < 1 || day > 31 ) return false;

    if ( [ 4, 6, 9, 11 ].includes( month ) && day === 31 ) return false;

    if ( month === 2 && day > 29 ) return false;

    if ( ! isLeap( year ) && month === 2 && day > 28 ) return false;

    return true;
}

export { isTypingYearMonthDay, isYearMonthDay };