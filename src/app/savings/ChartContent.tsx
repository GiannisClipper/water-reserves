"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface resultType {
    headers: string[];
    data: any[];
}[]

type propsType = {
    result: resultType
}

const ChartContent = ( { result }: propsType ) => {

    const headers: string[] = result && result.headers || [];
    const data: [][] = result && result.data || [];

    const ticks = data.map( (row: any[]) => row[ 0 ] )
    const data2 = data.map( (row: any[]) => ({ time: row[ 0 ], "Ποσότητα": row[ 1 ] }) )

    console.log( "rendering: ChartContent...", data, data2 )

    return (
        <div className="ChartContent">
            <ResponsiveContainer height="100%" width="100%">
                <AreaChart
                    data={data2}
                    margin={{ top: 20, right: 20, bottom: 60, left: 40, }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" ticks={ticks} interval={0} angle={-90} tickMargin={45}/>
                    <YAxis domain={[ 'dataMin', 'dataMax' ]} />
                    <Area dataKey="Ποσότητα" stroke="lightgrey" fill="lightblue" />
                    <Tooltip />
                </AreaChart>
            </ResponsiveContainer>
            <span>-</span>
        </div>
    );

}

export default ChartContent;