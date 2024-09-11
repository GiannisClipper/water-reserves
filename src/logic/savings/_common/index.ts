import type { ObjectType } from '@/types';

type LineType = 'linear' | 'monotone';

const getLineType = ( xTicks: string[] ): LineType => 
    xTicks.length && xTicks[ 0 ].length === 10 ? 'linear' : 'monotone';

const getAggregatedData = ( responseResult: any ): ObjectType[] => {

    let data: any[][] = responseResult && responseResult.data || [];

    const result: ObjectType[] = data.map( ( row: any[], i: number ) => {
        const time: string = row[ 0 ];
        const quantity: number = Math.round( row[ 1 ] );

        let diff: number = 0;
        let percent: number = 0;
        if ( i > 0 ) {
            const prevQuantity: number = Math.round( data[ i - 1 ][ 1 ] );
            diff = quantity - prevQuantity
            percent = Math.round( diff / prevQuantity * 10000 ) / 100;
        }

        return { time, quantity, diff, percent };
    } );

    return result;
}

export type { LineType };

export { 
    getLineType, getAggregatedData, 
};