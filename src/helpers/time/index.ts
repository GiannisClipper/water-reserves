const timeKey = ( value: string ): string => {

    switch ( value.length ) {
        case 10:
            return 'date';
        case 7:
            return 'month';
        case 4:
            return 'year';
        case 9:
            return 'custom_year';
        }
    return '';
}

const timeLabel = ( value: string ): string => {

    switch ( value.length ) {
        case 10:
            return 'Ημ/νία';
        case 7:
            return 'Μήνας';
        case 4:
            return 'Έτος';
        case 9:
            return 'Υδρολογικό έτος';
    
    }
    return '';
}

function setFunctionOnDelay( func: CallableFunction, ms: number ) {

    let timer: any;

    return () => {
        // console.log( 'execute with delay: delay' )
        clearTimeout( timer );
        timer = setTimeout( () => { 
            timer = null; 
            // console.log( 'executeWithDelay: execute' )
            func(); 
        }, ms )
    };
}

export { timeKey, timeLabel, setFunctionOnDelay };