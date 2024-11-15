const intervalRepr = ( searchParams: SearchParamsType ) => {
    if ( ! searchParams.interval_filter ) {
        return '';
    }

    const parts = searchParams.interval_filter.split( ',' );
    parts[ 0 ] = parts[ 0 ].split( '-' ).reverse().join( '/' );
    parts[ 1 ] = parts[ 1 ].split( '-' ).reverse().join( '/' );

    return ` (interval: ${parts[ 0 ]}-${parts[ 1 ]})`;
}

export { intervalRepr };