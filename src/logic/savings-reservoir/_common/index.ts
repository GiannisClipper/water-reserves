import ObjectList from '@/helpers/objects/ObjectList';

import type { ObjectType } from '@/types';

const getReservoirs = ( result: any ): ObjectType[] => {

    let reservoirs: ObjectType[] = result && result.legend && result.legend.reservoirs || [];

    // sortBy start: chart lines will be displayed from bottom to top (most recent reservoir on top)
    reservoirs = new ObjectList( reservoirs ).sortBy( 'start', 'asc' );

    return reservoirs;
}

const parseData = ( responseResult: any ): ObjectType[] => {

    let data: any[][] = responseResult && responseResult.data || [];

    return data.map( ( row: any[], i: number ) => {
        const time: string = row[ 0 ];
        const reservoir_id: string = row[ 1 ];
        const quantity: number = Math.round( row[ 2 ] );
        return { time, reservoir_id, quantity };
    } );
}

// const removeId = ( data: ObjectType[] ): ObjectType[] => {

//     return data.map( ( row: ObjectType ) => {
//         const { id, ...otherKeys } = row;
//         return { ...otherKeys };
//     } );
// }

const aggregateReservoirs = ( data: ObjectType[] ): ObjectType[] => {

    const timeObj: ObjectType = {};

    data.forEach( ( row: ObjectType ) => { 
        const { time } = row;
        timeObj[ time ] = { time, quantities: {} };
    } );

    data.forEach( ( row: ObjectType ) => {
        const { time, reservoir_id, quantity } = row;
        timeObj[ time ].quantities[ reservoir_id ] = quantity;
    } );

    return Object.values( timeObj );
}

const addTotal = ( data: ObjectType[] ): ObjectType[] => {

    return data.map( ( row: ObjectType ) => {
        const { quantities, ...otherKeys } = row;
        const total = Object.values( quantities ).reduce( ( a, b ) => a + b, 0 );
        return { ...otherKeys, quantities, total };
    } );
}

const getNonAggregatedData = ( responseResult: any, reservoirs: ObjectType[] ): ObjectType[] => {

    let result: ObjectType[] = parseData( responseResult );
    // result = removeId( result );
    result = aggregateReservoirs( result );
    result = addTotal( result );
    // console.log( 'result', result )
    return result;
}

export { 
    getReservoirs, getNonAggregatedData
};