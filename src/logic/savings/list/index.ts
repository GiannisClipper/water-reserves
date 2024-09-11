import { timeKey } from "@/helpers/time";
import { ObjectType } from "@/types";

const getHeaders = ( data: ObjectType[] ): string[] => {

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

export { getHeaders };
