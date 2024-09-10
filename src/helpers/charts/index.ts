import ObjectList from '@/helpers/ObjectList';

import type { ObjectType } from '@/types';

type LineType = 'linear' | 'monotone';

const getLineType = ( xTicks: string[] ): LineType => 
    xTicks.length && xTicks[ 0 ].length === 10 ? 'linear' : 'monotone';

const getReservoirs = ( result: any ): ObjectType[] => {

    let reservoirs: ObjectType[] = result && result.legend && result.legend.reservoirs || [];

    // sortBy start: chart lines will be displayed from bottom to top (most recent reservoir on top)
    reservoirs = new ObjectList( reservoirs ).sortBy( 'start', 'asc' );

    return reservoirs;
}

const getAggregatedData = ( responseResult: any ): ObjectType[] => {

    let data: any[][] = responseResult && responseResult.data || [];

    const result: ObjectType[] = data.map( ( row: any[], i: number ) => {
        const time: string = row[ 0 ];
        const quantity: number = Math.round( row[ 1 ] );

        let diff: number = 0;
        if ( i > 0 ) {
            const prevQuantity: number = Math.round( data[ i - 1 ][ 1 ] );
            diff = Math.round( ( quantity - prevQuantity ) / prevQuantity * 10000 ) / 100;
        }

        return { time, quantity, diff };
    } );

    return result;
}

const getNonAggregatedData = ( responseResult: any, reservoirs: ObjectType[] ): ObjectType[] => {

    let data: any[][] = responseResult && responseResult.data || [];

    data = data.map( row => {
        if ( row.length === 4 ) {
            // excluding id (1st pos) if exists
            return row.slice( 1, );
        }
        return row;
    } );

    const timeObj: { [ key: string ]: any } = {};
    data.forEach( ( row: any[] ) => {
        const time: string = row[ 0 ];
        timeObj[ time ] = { time, total: 0 } 
    } );

    data.forEach( ( row: any[] ) => {
        const time: string = row[ 0 ];
        const reservoir_id: string = row[ 1 ];
        const quantity: number = Math.round( row[ 2 ] );
        const reservoir: ObjectType | null = new ObjectList( reservoirs ).findOne( 'id', reservoir_id );
        const qLabel: string = ( reservoir && reservoir.name_el ) || ( `q_${reservoir_id}` );
        timeObj[ time ][ qLabel ] = quantity;
        timeObj[ time ].total += quantity;
    } );

    const result: ObjectType[] = Object.values( timeObj );
    return result;
}

const _getYLimits = ( minValue: number, maxValue: number ): [ number, number ] => {

    const log: number = Math.floor( Math.log10( ( maxValue - minValue ) / 10 ) );
    const baseUnit: number = Math.pow( 10, log );
    return [
        Math.floor( minValue / baseUnit ) * baseUnit,
        Math.ceil( maxValue / baseUnit ) * baseUnit
    ]
}

const getYTicks = ( data: ObjectType[] ): number[] => {

    const minYValues = data.map( ( row: ObjectType ) => {
        const { time, total, ...quantities } = row;
        return Math.min( ...Object.values( quantities ) );
    } );

    const maxYValues = data.map( ( row: ObjectType ) => {
        const { time, total, ...quantities } = row;
        return total === undefined 
            ? Math.max( ...Object.values( quantities ) )
            : total;
    } );

    const [ minYValue, maxYValue ] = _getYLimits( 
        Math.min( ...minYValues ) * 1.10,
        Math.max( ...maxYValues ) * 1.05
    ); 

    const diff: number = ( maxYValue - minYValue ) * .5;
    const log: number = Math.floor( Math.log10( diff ) );
    const baseUnit: number = Math.pow( 10, log );

    let value = minYValue > baseUnit ? minYValue : 0;
    const result = [ value ];
    while ( value < maxYValue ) {
        value += baseUnit;
        result.push( value );
    }
    return result;
}

const getXTicks = ( data: ObjectType[] ): string[] => {

    let values = data.map( ( row: { [ key: string ]: any } ) => row.time );

    console.log('values.length', values.length, values);
    if ( values.length === 0 ) {
        return values;
    }

    // reduce days to months
    if ( values[ 0 ].length === 10 && values.length > 31 ) {
        values = values.filter( ( v: string ) => v.substring( 8, 10 ) === '01' );
        values = values.map( ( v: string ) => v.substring( 0, 8 ) );
    }

    // reduce days to years
    // if ( values[ 0 ].length === 10 && values.length > 24 ) {
    //         values = values.filter( ( v: string ) => v.substring( 5, 7 ) === '01' );
    // }

    // reduce months to years
    if ( values[ 0 ].length === 7 && values.length > 24 ) {
        values = values.filter( ( v: string ) => v.substring( 5, 7 ) === '01' );
    }

    return values;
}

const makeReservoirsRepr = ( reservoirs: ObjectType[], quantities: ObjectType ): ObjectType[] => {

    // toReversed: considering the order of lines in chart (from bottom to top)
    const result: ObjectType[] = reservoirs.toReversed().map( ( reservoir: ObjectType, i: number ) => {

        const { name_el: name } = reservoir;
        const quantity: number = quantities[ name ] || 0;
        const percentage: number = Math.round( quantity / quantities[ 'total' ] * 100 );
        return { name, quantity, percentage };
    } );

    return result;
}

const makeReservoirsOrderedRepr = ( reservoirs: ObjectType[], quantities: ObjectType ): ObjectType[] => {

    let result: ObjectType[] = makeReservoirsRepr( reservoirs, quantities );
    result = new ObjectList( result ).sortBy( 'quantity', 'desc' );
    return result;
}

export type { LineType };

export { 
    getReservoirs,
    getAggregatedData, getNonAggregatedData, 
    getYTicks, getXTicks, getLineType,
    makeReservoirsRepr, makeReservoirsOrderedRepr
};