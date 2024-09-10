"use client"

import { LineChart, Line } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { BarChart, Bar, Rectangle } from 'recharts';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { RequestResultType } from "@/types/requestResult";
import { getXTicks, getYTicks } from '@/helpers/charts';
import { commaView, plusView } from '@/helpers/numbers';
import { CustomizedXAxisTick } from '@/components/Page/Chart';
import { timeLabel } from '@/helpers/time';
import { SKY } from '@/styles/colors';

import "@/styles/chart.css";

type TooltipPropsType = {
    active?: boolean
    payload?: any
    label?: string
} 

const CustomTooltip = ( { active, payload, label }: TooltipPropsType ) => {

    if ( active && payload && payload.length ) {
        // console.log( 'label-payload', label, payload );
        const { time, quantity, diff } = payload[ 0 ].payload;

        return (
            <div className="Tooltip">
                <p>{ `${timeLabel( time )}: ${time}` }</p>
                <p>{ `Αποθέματα: ${commaView( quantity )}` } m<sup>3</sup></p>
                <p>{ `Διαφορά: ${plusView( diff )}%` }</p>
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
    const data: [][] = result && result.data || [];

    const xTicks: string[] = getXTicks( data.map( ( row: any[] ) => row[ 0 ] ) );

    const lineType: 'linear' | 'monotone' = xTicks.length && xTicks[ 0 ].length === 10 ? 'linear' : 'monotone';

    const yValues = data.map( ( row: any[] ) => row[ 1 ] );
    const maxValue = Math.max( ...yValues );
    const minValue = Math.min( ...yValues );

    const yTicks = getYTicks( 
        minValue - minValue * .10, 
        maxValue + maxValue * .05 
    );

    const chartData = data.map( ( row: any[], i: number ) => {
        const time: string = row[ 0 ];
        const quantity: number = Math.round( row[ 1 ] );

        let diff: number = 0;
        if ( i > 0 ) {
            const prevQuantity: number = Math.round( data[ i - 1 ][ 1 ] );
            diff = Math.round( ( quantity - prevQuantity ) / prevQuantity * 100 );
        }

        return { time, quantity, diff };
    } );

    console.log( "rendering: ChartContent...", data, chartData, xTicks, yTicks )

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
                        // cursor={{fill: 'transparent'}}
                        cursor={{ fill: '#0369a1' }}
                        content={ <CustomTooltip /> } 
                    />

                    <Bar 
                        dataKey="quantity" 
                        // stroke="#00bbee" 
                        // fill="#00ccff" 
                        stroke={ SKY[ 400 ] } 
                        fill={ SKY[ 300 ] } 
                        // activeBar={ <Rectangle fill="#11ddff" stroke="#999" /> } 
                    />
                </BarChart>

                :   
                chartType === 'area'
                ?
                <AreaChart
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
                        content={ <CustomTooltip /> } 
                    />

                    <Area 
                        dataKey="quantity"
                        type={ lineType } 
                        // stroke="#00bbee" 
                        // fill="#00ccff" 
                        stroke={ SKY[ 400 ] } 
                        fill={ SKY[ 300 ] } 
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
                        content={ <CustomTooltip /> } 
                    />

                    <Line 
                        dataKey="quantity"
                        type={ lineType } 
                        // stroke="#00bbee" 
                        stroke={ SKY[ 500 ] } 
                        strokeWidth={ 2 } 
                        dot={ false }
                    />
                </LineChart>
                }
                
            </ResponsiveContainer>
            {/* <span>-</span> */}
        </div>
    );

}

export default ChartContent;