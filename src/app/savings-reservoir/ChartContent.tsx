"use client"

import { LineChart, Line, Legend } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { BarChart, Bar, Rectangle } from 'recharts';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { RequestResultType } from "@/types/requestResult";
import { getYTicks, getXTicks } from '@/helpers/charts';
import { commaView } from '@/helpers/numbers';
import { CustomizedXAxisTick } from '@/components/Page/Chart';
import { timeLabel } from '@/helpers/time';
import { SKY } from '@/styles/colors';
import { ObjectType } from '@/types';
import ObjectList from '@/helpers/ObjectList';

import "@/styles/chart.css";

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

type TooltipPropsType = {
    active?: boolean
    payload?: any
    label?: string
    reservoirs: ObjectType[]
    makeReservoirsRepr: CallableFunction
} 

const CustomTooltip = ( { active, payload, label, reservoirs, makeReservoirsRepr }: TooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        const { time, ...quantities } = payload[ 0 ].payload;
        const { total } = quantities;
        const reservoirsRepr: ObjectType[] = makeReservoirsRepr( reservoirs, quantities );

        return (
            <div className="Tooltip">
                <p>{ `${timeLabel( time )}: ${time}` }</p>

                <table>
                    <tbody>
                        <tr className='total'>
                            <td>Σύνολο</td> 
                            <td className='value'>{ commaView( total ) } m<sup>3</sup></td>
                        </tr>
                        { reservoirsRepr.map( ( reservoir, i ) =>
                            <tr key={ i }>
                                <td>{ reservoir.name }</td>
                                <td className='value'>{ commaView( reservoir.quantity )} m<sup>3</sup></td> 
                                <td className='value'>{ `${reservoir.percentage}%` }</td>
                            </tr>
                        ) }
                    </tbody>
                </table>

            </div>
      );
    }
  
    return null;
};

type PropsType = { 
    result: RequestResultType | null
    chartType: string | undefined
}

const ChartContent = ( { result, chartType }: PropsType ) => {

    const headers: string[] = result && result.headers || [];
    let data: any[][] = result && result.data || [];
    let reservoirs: ObjectType[] = result && result.legend && result.legend.reservoirs || [];
    reservoirs = new ObjectList( reservoirs ).sortBy( 'start', 'asc' );

    data = data.map( row => {
        if ( row.length === 4 ) {
            // excluding id (1st pos) if exists
            return row.slice( 1, );
        }
        return row
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

    const chartData = Object.values( timeObj );

    const xTicks: string[] = getXTicks( chartData.map( ( row: { [ key: string ]: any } ) => row.time ) );

    const lineType: 'linear' | 'monotone' = xTicks.length && xTicks[ 0 ].length === 10 ? 'linear' : 'monotone';

    const minYValues = chartData.map( ( row: { [ key: string ]: any } ) => {
        const { time, total, ...quantities } = row;
        return Math.min( ...Object.values( quantities ) );
    } );

    const maxYValues = chartData.map( ( row: { [ key: string ]: any } ) => row.total );

    const minYValue = Math.min( ...minYValues );
    const maxYValue = Math.max( ...maxYValues );

    const yTicks = getYTicks( 
        minYValue - minYValue * .10, 
        maxYValue + maxYValue * .05 
    );
    
    const STROKES: string[] = [ "1 1", "2 2", "4 4", "8 8" ];

    console.log( "rendering: ChartContent...", data, chartData )

    return (
        <div className="ChartContent">
            <ResponsiveContainer height="100%" width="100%">

                { chartType === 'bar'
                ?
                <BarChart
                    data={ chartData }
                    margin={{ top: 20, right: 20, bottom: 60, left: 40 }}
                >
                    <CartesianGrid 
                        strokeDasharray="3 3" 
                    />

                    <XAxis 
                        dataKey="time" 
                        ticks={ xTicks } 
                        interval={ 0 } 
                        tick={ <CustomizedXAxisTick data={ chartData } /> } 
                    />

                    <YAxis 
                        domain={ [ yTicks[ 0 ], yTicks[ yTicks.length -1 ] ] } 
                        ticks={ yTicks } 
                        interval={ 0 } 
                        tickFormatter={ x => commaView( x ) } 
                    />

                    <Tooltip 
                        cursor={{ fill: '#0369a1' }}
                        content={ 
                            <CustomTooltip 
                                reservoirs={ reservoirs } 
                                makeReservoirsRepr={ makeReservoirsRepr }
                            /> 
                        } 
                    />

                    { reservoirs.map( ( r, i ) =>
                        <Bar 
                            key={ i } 
                            type={ lineType } 
                            dataKey={ r.name_el }
                            stackId="a"
                            fill={ SKY[ 600 - i * 100 ] } 
                            fillOpacity={ 1 }
                        />
                    ) }

                    <Legend 
                        align="right" 
                        verticalAlign='top' 
                    />
                </BarChart>

                :
                chartType === 'area'
                ?
                <AreaChart
                    data={ chartData }
                    margin={{ top: 20, right: 20, bottom: 60, left: 40 }}
                    // stackOffset="expand"
                >
                    <CartesianGrid 
                        strokeDasharray="3 3" 
                    />

                    <XAxis 
                        dataKey="time" 
                        ticks={ xTicks } 
                        interval={ 0 } 
                        tick={ <CustomizedXAxisTick data={ chartData } /> } 
                    />

                    <YAxis 
                        domain={ [ yTicks[ 0 ], yTicks[ yTicks.length -1 ] ] } 
                        ticks={ yTicks } 
                        interval={ 0 } 
                        tickFormatter={ x => commaView( x ) } 
                    />

                    {/* <YAxis tickFormatter={ decimal => `${(decimal * 100).toFixed( 0 )}%` } /> */}

                    <Tooltip 
                        content={ 
                            <CustomTooltip 
                                reservoirs={ reservoirs } 
                                makeReservoirsRepr={ makeReservoirsRepr }
                            /> 
                        } 
                    />

                    { reservoirs.map( ( r, i ) =>
                        <Area 
                            key={ i } 
                            type={ lineType } 
                            dataKey={ r.name_el }
                            stackId="a"
                            stroke={ SKY[ 600 - i * 100 ] } 
                            fill={ SKY[ 600 - i * 100 ] } 
                            fillOpacity={ .65 } 
                        />
                    ) }

                    <Legend 
                        align="right" 
                        verticalAlign='top' 
                    />
                </AreaChart>

                :
                <LineChart
                    data={ chartData }
                    margin={{ top: 20, right: 20, bottom: 60, left: 40 }}
                >
                    <CartesianGrid 
                        strokeDasharray="3 3" 
                    />

                    <XAxis 
                        dataKey="time" 
                        ticks={ xTicks } 
                        interval={ 0 } 
                        tick={ <CustomizedXAxisTick data={ chartData } /> } 
                    />

                    <YAxis 
                        domain={ [ yTicks[ 0 ], yTicks[ yTicks.length - 1 ] ] } 
                        ticks={ yTicks } 
                        interval={ 0 } 
                        tickFormatter={ x => commaView( x ) } 
                    />

                    <Tooltip 
                        content={ 
                            <CustomTooltip 
                                reservoirs={ reservoirs } 
                                makeReservoirsRepr={ makeReservoirsOrderedRepr }
                            /> 
                        } 
                    />

                    { reservoirs.map( ( r, i ) =>
                        <Line 
                            key={ i } 
                            type={ lineType } 
                            dataKey={ r.name_el } 
                            stroke={ SKY[ 600 ] } 
                            strokeWidth={ 2 } 
                            strokeDasharray={ STROKES[ i ] }
                            dot={ false }
                            legendType="plainline"
                        />
                    ) }

                    <Line 
                        type={ lineType } 
                        dataKey="total"
                        stroke={ SKY[ 600 ] } 
                        strokeWidth={ 2 } 
                        dot={ false }
                        legendType="plainline"
                    />

                    <Legend 
                        align="right" 
                        verticalAlign='top' 
                    />
                </LineChart>
                }
                
            </ResponsiveContainer>
            {/* <span>-</span> */}
        </div>
    );

}

export default ChartContent;