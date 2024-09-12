const getAspect = ( aspect: number, setAspect: CallableFunction ): number => {

    if ( ! window ) {
        return aspect;
    }

    // considering css responsive settings
    const width = window.innerWidth >= 768
        ? window.innerWidth * .75
        : window.innerWidth

    const height = window.innerHeight * .55
    const result = width / height;
    
    if ( result !== aspect ) {
        setAspect( result );
    }
    
    return result;
}

export { getAspect };