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

type TooltipPropsType = {
    active?: boolean
    payload?: any
    label?: string
    reservoirs: ObjectType[]
} 

const CustomTooltip = ( { active, payload, label, reservoirs }: TooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        const { time, ...quantities } = payload[ 0 ].payload;
        const values: number[] = Object.values( quantities );
        const total: number = values.reduce( ( a: number, b: number ) => a + b, 0 );

        return (
            <div className="Tooltip">
                <p>{ `${timeLabel( time )}: ${time}` }</p>

                <table>
                    <tbody>
                        { reservoirs.toReversed().map( ( r, i ) => {

                            const quantity: number = quantities[ r.name_el ] || 0;
                            const ratio: number = Math.round( quantity / total * 100 );

                            return (
                                <tr key={ i }>
                                    <td>{ r.name_el }</td>
                                    <td className='value'>{ commaView( quantity )} m<sup>3</sup></td> 
                                    <td className='value'>{ `${ratio}%` }</td>
                                </tr>
                            );
                        } ) }

                        <tr className='total'>
                            <td>Σύνολο</td> 
                            <td className='value'>{ commaView( total ) } m<sup>3</sup></td>
                        </tr>
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
        timeObj[ time ] = { time } 
    } );

    data.forEach( ( row: any[] ) => {
        const time: string = row[ 0 ];
        const reservoir_id: string = row[ 1 ];
        const quantity: number = Math.round( row[ 2 ] );
        const reservoir: ObjectType | null = new ObjectList( reservoirs ).findOne( 'id', reservoir_id );
        const qLabel: string = ( reservoir && reservoir.name_el ) || ( `q_${reservoir_id}` );
        timeObj[ time ][ qLabel ] = quantity;
    } );

    const chartData = Object.values( timeObj );

    const xTicks: string[] = getXTicks( chartData.map( ( row: { [ key: string ]: any } ) => row.time ) );

    const lineType: 'linear' | 'monotone' = xTicks.length && xTicks[ 0 ].length === 10 ? 'linear' : 'monotone';

    const yValues = data.map( ( row: any[] ) => row[ 2 ] );

    const maxValue = Math.max( ...yValues );
    const minValue = Math.min( ...yValues );

    const yTicks = getYTicks( 
        minValue - minValue * .10, 
        maxValue + maxValue * .05 
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
                        content={ <CustomTooltip reservoirs={ reservoirs } /> } 
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
                        content={ <CustomTooltip reservoirs={ reservoirs } /> } 
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
                        content={ <CustomTooltip reservoirs={ reservoirs } /> } 
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