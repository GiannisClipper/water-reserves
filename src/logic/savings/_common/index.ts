type LineType = 'linear' | 'monotone';

const getLineType = ( xTicks: string[] ): LineType => 
    xTicks.length && xTicks[ 0 ].length === 10 ? 'linear' : 'monotone';

export type { LineType };

export { getLineType };
