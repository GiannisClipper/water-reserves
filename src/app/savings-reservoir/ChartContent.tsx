"use client";

import { useEffect, useState } from 'react';
import { LineChart, Line, Legend } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { BarChart, Bar, Rectangle } from 'recharts';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { RequestResultType } from "@/types/requestResult";
import { getYTicks, getXTicks } from '@/helpers/charts';
import { commaView } from '@/helpers/numbers';
import { CustomizedXAxisTick } from '@/components/Charts';

type PropsType = { 
    result: RequestResultType | null
    chartType: string | undefined
}

const ChartContent = ( { result, chartType }: PropsType ) => {

    const headers: string[] = result && result.headers || [];
    const data: [][] = result && result.data || [];

    // TODO: refactor data2 calculation
    const tmp: { [ key: string ]: any } = {};
    for ( let row of data ) {
        // console.log( 'row', row );
        if ( ! tmp[ row[ 0 ] ] ) {
            tmp[ row[ 0 ] ] = { time: row[ 0 ] };
        }
        tmp[ row[ 0 ] ][ `Ποσότητα_${row[ 1 ]}` ] = row[ 2 ];
    }
    const data2 = Object.values( tmp );

    const xTicks: string[] = getXTicks( data2.map( ( row: { [ key: string ]: any } ) => row.time ) );

    const yValues = data.map( ( row: any[] ) => row[ 2 ] );

    const maxValue = Math.max( ...yValues );
    const minValue = Math.min( ...yValues );

    const yTicks = getYTicks( 
        minValue - minValue * .10, 
        maxValue + maxValue * .05 
    );

    // const data2 = data.map( (row: any[]) => ({ time: row[ 0 ], "Ποσότητα": row[ 1 ] }) );

    console.log( "rendering: ChartContent...", data, data2 )

    return (
        <div className="ChartContent">
            <ResponsiveContainer height="100%" width="100%">

                { chartType === 'bar'
                ?
                <BarChart
                    data={data2}
                    margin={{ top: 20, right: 20, bottom: 60, left: 40 }}
                >
                    <CartesianGrid 
                        strokeDasharray="3 3" 
                    />

                    <XAxis 
                        dataKey="time" 
                        ticks={ xTicks } 
                        interval={ 0 } 
                        tick={ <CustomizedXAxisTick data={ data2 } /> } 
                    />

                    <YAxis 
                        domain={ [ yTicks[ 0 ], yTicks[ yTicks.length -1 ] ] } 
                        ticks={ yTicks } 
                        interval={ 0 } 
                        tickFormatter={ x => commaView( x ) } 
                    />

                    <Tooltip />

                    <Bar type="monotone" dataKey="Ποσότητα_1" fill="#00ffff" stroke="#00ffff" strokeWidth={2} />
                    <Bar type="monotone" dataKey="Ποσότητα_2" fill="#ff00ff" stroke="#ff00ff" strokeWidth={2} />
                    <Bar type="monotone" dataKey="Ποσότητα_3" fill="#ffff00" stroke="#ffff00" strokeWidth={2} />
                    <Bar type="monotone" dataKey="Ποσότητα_4" fill="#000000" stroke="#000000" strokeWidth={2} />

                    <Legend align="right" verticalAlign='top' />
                    {/* <Bar dataKey="Ποσότητα" stroke="#00bbee" fill="#00ccff" activeBar={<Rectangle fill="#11ddff" />} /> */}
                </BarChart>
                :
                chartType === 'area'
                ?
                <AreaChart
                    data={data2}
                    margin={{ top: 20, right: 20, bottom: 60, left: 40 }}
                >
                    <CartesianGrid 
                        strokeDasharray="3 3" 
                    />

                    <XAxis 
                        dataKey="time" 
                        ticks={ xTicks } 
                        interval={ 0 } 
                        tick={ <CustomizedXAxisTick data={ data2 } /> } 
                    />

                    <YAxis 
                        domain={ [ yTicks[ 0 ], yTicks[ yTicks.length -1 ] ] } 
                        ticks={ yTicks } 
                        interval={ 0 } 
                        tickFormatter={ x => commaView( x ) } 
                    />

                    <Tooltip />

                    <Area dataKey="Ποσότητα" stroke="#00bbee" fill="#00ccff" />
                </AreaChart>
                :
                <LineChart
                    data={data2}
                    margin={{ top: 20, right: 20, bottom: 60, left: 40 }}
                >
                    <CartesianGrid 
                        strokeDasharray="3 3" 
                    />

                    <XAxis 
                        dataKey="time" 
                        ticks={ xTicks } 
                        interval={ 0 } 
                        tick={ <CustomizedXAxisTick data={ data2 } /> } 
                    />

                    <YAxis 
                        domain={ [ yTicks[ 0 ], yTicks[ yTicks.length -1 ] ] } 
                        ticks={ yTicks } 
                        interval={ 0 } 
                        tickFormatter={ x => commaView( x ) } 
                    />

                    <Tooltip />

                    <Line type="monotone" dataKey="Ποσότητα_1" stroke="#00ffff" strokeWidth={2} />
                    <Line type="monotone" dataKey="Ποσότητα_2" stroke="#ff00ff" strokeWidth={2} />
                    <Line type="monotone" dataKey="Ποσότητα_3" stroke="#ffff00" strokeWidth={2} />
                    <Line type="monotone" dataKey="Ποσότητα_4" stroke="#000000" strokeWidth={2} />

                    <Legend align="right" verticalAlign='top' />
                </LineChart>
                }
                
            </ResponsiveContainer>
            {/* <span>-</span> */}
        </div>
    );

}

export default ChartContent;