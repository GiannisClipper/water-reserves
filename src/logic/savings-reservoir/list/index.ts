import { timeKey } from "@/helpers/time";
import { ObjectType } from "@/types";

const getHeaders = ( data: ObjectType[], reservoirs: ObjectType[] ): string[] => {

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

export { getHeaders };
