import type { ObjectType } from '@/types';

type LineType = 'linear' | 'monotone';

const getLineType = ( xTicks: string[] ): LineType => 
    xTicks.length && xTicks[ 0 ].length === 10 ? 'linear' : 'monotone';

const parseData = ( responseResult: any ): ObjectType[] => {

    let data: any[][] = responseResult && responseResult.data || [];

    return data.map( ( row: any[], i: number ) => {
        const time: string = row[ 0 ];
        const quantity: number = Math.round( row[ 1 ] );
        return { time, quantity };
    } );
}

const addDiff = ( data: ObjectType[] ): ObjectType[] => {

    return data.map( ( row: ObjectType, i: number ) => {

        const { time, quantity } = row;

        let diff: number = 0;
        let percent: number = 0;
        if ( i > 0 ) {
            const prevQuantity: number = Math.round( row[ i - 1 ].quantity );
            diff = quantity - prevQuantity
            percent = Math.round( diff / prevQuantity * 10000 ) / 100;
        }

        return { time, quantity, diff, percent };
    } );
}

const getAggregatedData = ( responseResult: any ): ObjectType[] => {

    let result: ObjectType[] = parseData( responseResult );
    result = addDiff( result );
 
    return result;
}

export type { LineType };

export { 
    getAggregatedData,
    getLineType, 
};