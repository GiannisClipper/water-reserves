"use client";

import { useEffect, useState } from 'react';
import { LineChart, Line, Legend } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { BarChart, Bar, Rectangle } from 'recharts';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { RequestResultType } from "@/types/requestResult";
import { getYTicks, getXTicks } from '@/helpers/charts';
import { commaView } from '@/helpers/numbers';
import { CustomizedXAxisTick } from '@/components/Page/Chart';
import { timeLabel } from '@/helpers/time';
import { GREENISH_COLOR, BLUEISH_COLOR, YELLOWISH_COLOR, REDISH_COLOR } from '../settings';

import "@/styles/chart.css";

type TooltipPropsType = {
    active?: boolean
    payload?: any
    label?: string
} 

const CustomTooltip = ( { active, payload, label }: TooltipPropsType ) => {

    if ( active && payload && payload.length ) {
        // console.log( 'label-payload', label, payload );
        const { time, q1, q2, q3, q4 } = payload[ 0 ].payload;

        return (
            <div className="Tooltip">
                <p>{ `${timeLabel( time )}: ${time}` }</p>
                { q1 ? <p>{ `Ποσότητα 1: ${commaView( q1 )} κμ` }</p> : null }
                { q2 ? <p>{ `Ποσότητα 2: ${commaView( q2 )} κμ` }</p> : null }
                { q3 ? <p>{ `Ποσότητα 3: ${commaView( q3 )} κμ` }</p> : null }
                { q4 ? <p>{ `Ποσότητα 4: ${commaView( q4 )} κμ` }</p> : null }
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

    // TODO: refactor data2 calculation

    data = data.map( row => {
        // to exclude the 1st position (id)
        if ( row.length === 4 ) {
            return row.slice( 1, );
        }
        return row
    } );

    const timeObj: { [ key: string ]: any } = {};
    for ( let row of data ) {
        // console.log( 'row', row );
        if ( ! timeObj[ row[ 0 ] ] ) {
            timeObj[ row[ 0 ] ] = { time: row[ 0 ] };
        }
        timeObj[ row[ 0 ] ][ `q${row[ 1 ]}` ] = row[ 2 ];
    }
    const data2 = Object.values( timeObj );

    const xTicks: string[] = getXTicks( data2.map( ( row: { [ key: string ]: any } ) => row.time ) );

    const lineType: 'linear' | 'monotone' = xTicks.length && xTicks[ 0 ].length === 10 ? 'linear' : 'monotone';

    const yValues = data.map( ( row: any[] ) => row[ 2 ] );

    const maxValue = Math.max( ...yValues );
    const minValue = Math.min( ...yValues );

    const yTicks = getYTicks( 
        minValue - minValue * .10, 
        maxValue + maxValue * .05 
    );

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

                    <Tooltip 
                        content={ <CustomTooltip /> } 
                    />

                    <Bar type="monotone" dataKey="q1" stackId="a" fill={YELLOWISH_COLOR} stroke={YELLOWISH_COLOR} strokeWidth={2} />
                    <Bar type="monotone" dataKey="q2" stackId="a" fill={REDISH_COLOR} stroke={REDISH_COLOR} strokeWidth={2} />
                    <Bar type="monotone" dataKey="q3" stackId="a" fill={GREENISH_COLOR} stroke={GREENISH_COLOR} strokeWidth={2} />
                    <Bar type="monotone" dataKey="q4" stackId="a" fill={BLUEISH_COLOR} stroke={BLUEISH_COLOR} strokeWidth={2} />

                    <Legend align="right" verticalAlign='top' />
                    {/* <Bar dataKey="Ποσότητα" stroke="#00bbee" fill="#00ccff" activeBar={<Rectangle fill="#11ddff" />} /> */}
                </BarChart>
                :
                chartType === 'area'
                ?
                <AreaChart
                    data={data2}
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
                        tick={ <CustomizedXAxisTick data={ data2 } /> } 
                    />

                    <YAxis 
                        domain={ [ yTicks[ 0 ], yTicks[ yTicks.length -1 ] ] } 
                        ticks={ yTicks } 
                        interval={ 0 } 
                        tickFormatter={ x => commaView( x ) } 
                    />

                    {/* <YAxis tickFormatter={ decimal => `${(decimal * 100).toFixed( 0 )}%` } /> */}

                    <Tooltip 
                        content={ <CustomTooltip /> } 
                    />

                    <Area type="monotone" dataKey="q1" stackId="1" stroke={YELLOWISH_COLOR} fill={YELLOWISH_COLOR} fillOpacity={.5} />
                    <Area type="monotone" dataKey="q2" stackId="1" stroke={REDISH_COLOR} fill={REDISH_COLOR} fillOpacity={.5} />
                    <Area type="monotone" dataKey="q3" stackId="1" stroke={GREENISH_COLOR} fill={GREENISH_COLOR} fillOpacity={.5} />
                    <Area type="monotone" dataKey="q4" stackId="1" stroke={BLUEISH_COLOR} fill={BLUEISH_COLOR} fillOpacity={.5} />

                    <Legend 
                        align="right" 
                        verticalAlign='top' 
                    />
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
                        domain={ [ yTicks[ 0 ], yTicks[ yTicks.length - 1 ] ] } 
                        ticks={ yTicks } 
                        interval={ 0 } 
                        tickFormatter={ x => commaView( x ) } 
                    />

                    <Tooltip 
                        content={ <CustomTooltip /> } 
                    />

                    <Line type={ lineType } dataKey="q1" stroke={YELLOWISH_COLOR} strokeWidth={2} dot={ false }/>
                    <Line type={ lineType } dataKey="q2" stroke={REDISH_COLOR} strokeWidth={2} dot={ false } />
                    <Line type={ lineType } dataKey="q3" stroke={GREENISH_COLOR} strokeWidth={2} dot={ false } />
                    <Line type={ lineType } dataKey="q4" stroke={BLUEISH_COLOR} strokeWidth={2} dot={ false } />

                    <Legend align="right" verticalAlign='top' />
                </LineChart>
                }
                
            </ResponsiveContainer>
            {/* <span>-</span> */}
        </div>
    );

}

export default ChartContent;