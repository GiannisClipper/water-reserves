import { timeKey } from "@/helpers/time";
import { ObjectType } from "@/types";

const getAggregatedHeaders = ( data: ObjectType[] ): string[] => {

    const headers: string[] = [];

    if ( data.length ) {
        const { time } = data[ 0 ];
        headers.push( timeKey( time ) );
        headers.push( 'quantity' );
        headers.push( 'diff' );
        headers.push( 'percent' );
    }

    return headers;
}

const getNonAggregatedHeaders = ( data: ObjectType[], reservoirs: ObjectType[] ): string[] => {

    const headers: string[] = [];

    if ( data.length ) {
        const { time, quantities } = data[ 0 ];
        headers.push( timeKey( time ) );
        headers.push( 'total' );

        const ids: string[] = Object.keys( quantities );
        reservoirs = reservoirs.filter( r => ids.includes( `${r.id}` ) );
        reservoirs.forEach( r => {
            headers.push( r.name_en ) 
            headers.push( 'percent' ) 
        } );
    }

    return headers;
}

export { getAggregatedHeaders, getNonAggregatedHeaders };
