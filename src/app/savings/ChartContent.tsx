"use client";

import { useEffect, useState } from 'react';
import { LineChart, Line } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { BarChart, Bar, Rectangle } from 'recharts';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { RequestResultType } from "@/types/requestResult";

type PropsType = { result: RequestResultType | null }

const ChartContent = ( { result }: PropsType ) => {

    const [ chartType, setChartType ] = useState<string | null>( null );

    useEffect( () => {
        const urlSearchString = window.location.search;
        const params = new URLSearchParams( urlSearchString );
        setChartType( params.get( 'chart_type' ) );
        console.log( chartType );
    } );

    const headers: string[] = result && result.headers || [];
    const data: [][] = result && result.data || [];

    const xTicks = data.map( (row: any[]) => row[ 0 ] );
    const yValues = data.map( (row: any[]) => row[ 1 ] );

    const maxValue = Math.max( ...yValues );
    const logMaxValue = Math.floor( Math.log10( maxValue ) );
    let maxYValue = Math.pow( 10, logMaxValue );
    const maxYRatio = Math.ceil( ( maxValue / maxYValue ) * 10 ) / 10;
    maxYValue = Math.round( maxYValue * maxYRatio );

    const minValue = Math.min( ...yValues );
    const logMinValue = Math.floor( Math.log10( minValue ) );
    let minYValue = Math.pow( 10, logMinValue );
    const minYRatio = Math.floor( ( minValue / minYValue ) * 10 ) / 10;
    minYValue = Math.round( minYValue * minYRatio );

    let diff = maxYValue - minYValue;
    maxYValue += diff * .1;
    minYValue -= diff * .1;
    diff *= 1.2

    const yTicks = [ minYValue, minYValue + diff * .25, minYValue + diff * .50, minYValue + diff * .75, maxYValue ]
    const data2 = data.map( (row: any[]) => ({ time: row[ 0 ], "Ποσότητα": row[ 1 ] }) );

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
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" ticks={xTicks} interval={0} angle={-90} tickMargin={45}/>
                    <YAxis domain={[ minYValue, maxYValue ]} ticks={yTicks} interval={0} tickFormatter={ x=> `(${x})`} />
                    <Tooltip />
                    <Bar dataKey="Ποσότητα" stroke="#00bbee" fill="#00ccff" activeBar={<Rectangle fill="#11ddff" />} />
                </BarChart>
                :
                chartType === 'area'
                ?
                <AreaChart
                    data={data2}
                    margin={{ top: 20, right: 20, bottom: 60, left: 40 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" ticks={xTicks} interval={0} angle={-90} tickMargin={45}/>
                    <YAxis domain={[ minYValue, maxYValue ]} ticks={yTicks} interval={0} tickFormatter={ x=> `(${x})`} />
                    <Tooltip />
                    <Area dataKey="Ποσότητα" stroke="#00bbee" fill="#00ccff" />
                </AreaChart>
                :
                <LineChart
                    data={data2}
                    margin={{ top: 20, right: 20, bottom: 60, left: 40 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" ticks={xTicks} interval={0} angle={-90} tickMargin={45}/>
                    <YAxis domain={[ minYValue, maxYValue ]} ticks={yTicks} interval={0} tickFormatter={ x=> `(${x})`} />
                    <Tooltip />
                    <Line type="monotone" dataKey="Ποσότητα" stroke="#00bbee" strokeWidth={2} />
                </LineChart>
                }
                
            </ResponsiveContainer>
            <span>-</span>
        </div>
    );

}

export default ChartContent;