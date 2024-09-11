import ObjectList from '@/helpers/objects/ObjectList';

import type { ObjectType } from '@/types';

const getReservoirs = ( responseResult: any, data: ObjectType[] ): ObjectType[] => {

    let reservoirs: ObjectType[] = responseResult && responseResult.legend && responseResult.legend.reservoirs || [];

    if ( data.length ) {
        const { quantities } = data[ 0 ];
        const ids: string[] = Object.keys( quantities );
        reservoirs = reservoirs.filter( r => ids.includes( `${r.id}` ) );
    }

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

const aggregateReservoirs = ( data: ObjectType[] ): ObjectType[] => {

    const timeObj: ObjectType = {};

    data.forEach( ( row: ObjectType ) => { 
        const { time } = row;
        timeObj[ time ] = { time, quantities: {} };
    } );

    data.forEach( ( row: ObjectType ) => {
        const { time, reservoir_id, quantity } = row;
        timeObj[ time ].quantities[ reservoir_id ] = { quantity };
    } );

    return Object.values( timeObj );
}

const addTotal = ( data: ObjectType[] ): ObjectType[] => {

    return data.map( ( row: ObjectType ) => {

        const { quantities, ...otherKeys } = row;

        const total = Object
            .values( quantities )
            .map( q => q.quantity )
            .reduce( ( a, b ) => a + b, 0 );

        return { ...otherKeys, quantities, total };
    } );
}

const addPercent = ( data: ObjectType[] ): ObjectType[] => {

    return data.map( ( row: ObjectType ) => {
        const { quantities, ...otherKeys } = row;
        const total: number = Object
            .values( quantities )
            .map( q => q.quantity )
            .reduce( ( a, b ) => a + b, 0 );

        Object.keys( quantities ).forEach( id => {
            quantities[ id ].percent = Math.round( quantities[ id ].quantity / total * 100 );
        } );

        return { ...otherKeys, quantities };
    } );
}

const getNonAggregatedData = ( responseResult: any ): ObjectType[] => {

    let result: ObjectType[] = parseData( responseResult );
    result = aggregateReservoirs( result );
    result = addTotal( result );
    result = addPercent( result );

    return result;
}

export { 
    parseData, aggregateReservoirs, addTotal,
    getReservoirs, getNonAggregatedData
};