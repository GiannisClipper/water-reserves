"use client"

import { LineChart, Line } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { BarChart, Bar, Rectangle } from 'recharts';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { RequestResultType } from "@/types/requestResult";
import { getAggregatedData, getXTicks, getYTicks, getLineType } from '@/logic/savings/chart';
import { withCommas, withPlusSign } from '@/helpers/numbers';
import { CustomizedXAxisTick } from '@/components/Page/Chart';
import { timeLabel } from '@/helpers/time';

import type { ObjectType } from '@/types';
import type { LineType } from '@/logic/savings/chart';

import "@/styles/chart.css";
import { SKY } from '@/styles/colors';

type PropsType = { 
    result: RequestResultType | null
    chartType: string | undefined
}

const ChartContent = ( { result, chartType }: PropsType ) => {

    const data: ObjectType[] = getAggregatedData( result );
    const xTicks: string[] = getXTicks( data );
    const yTicks: number[] = getYTicks( data );
    const lineType: LineType = getLineType( xTicks );

    console.log( "rendering: ChartContent...", data, xTicks, yTicks )

    return (
        <div className="ChartContent">

            { chartType === 'bar'
            ?
            <BarChartComposition
                data={ data }
                xTicks={ xTicks }
                yTicks={ yTicks }
                lineType={ lineType }
                color={ SKY }
            />

            :
            chartType === 'area'
            ?
            <AreaChartComposition
                data={ data }
                xTicks={ xTicks }
                yTicks={ yTicks }
                lineType={ lineType }
                color={ SKY }
            />

            :
            <LineChartComposition
                data={ data }
                xTicks={ xTicks }
                yTicks={ yTicks }
                lineType={ lineType }
                color={ SKY }
            />
            }
        </div>
    );
}

type ChartCompositionPropsType = { 
    data: ObjectType[]
    xTicks: string[]
    yTicks: number[]
    lineType: LineType
    color: ObjectType
}

const LineChartComposition = ( { data, xTicks, yTicks, lineType, color }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer height="100%" width="100%">
            <LineChart
                data={ data }
                margin={{ top: 20, right: 20, bottom: 60, left: 40 }}
            >
                <CartesianGrid 
                    strokeDasharray="3 3" 
                />

                <XAxis 
                    dataKey="time" 
                    ticks={ xTicks } 
                    interval={ 0 } 
                    tick={ <CustomizedXAxisTick data={ data } /> } 
                />

                <YAxis 
                    domain={ [ yTicks[ 0 ], yTicks[ yTicks.length - 1 ] ] } 
                    ticks={ yTicks } 
                    interval={ 0 } 
                    tickFormatter={ x => withCommas( x ) } 
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
        </ResponsiveContainer>
    );
}

const AreaChartComposition = ( { data, xTicks, yTicks, lineType, color }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer height="100%" width="100%">
            <AreaChart
                data={ data }
                margin={{ top: 20, right: 20, bottom: 60, left: 40 }}
            >
                <CartesianGrid 
                    strokeDasharray="3 3" 
                />

                <XAxis 
                    dataKey="time" 
                    ticks={ xTicks } 
                    interval={ 0 } 
                    tick={ <CustomizedXAxisTick data={ data } /> } 
                />

                <YAxis 
                    domain={ [ yTicks[ 0 ], yTicks[ yTicks.length -1 ] ] } 
                    ticks={ yTicks } 
                    interval={ 0 } 
                    tickFormatter={ x => withCommas( x ) } 
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
        </ResponsiveContainer>
    );
}

const BarChartComposition = ( { data, xTicks, yTicks, lineType, color }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer height="100%" width="100%">
            <BarChart
                data={ data }
                margin={{ top: 20, right: 20, bottom: 60, left: 40 }}
            >
                <CartesianGrid 
                    strokeDasharray="3 3" 
                />

                <XAxis 
                    dataKey="time" 
                    ticks={ xTicks } 
                    interval={ 0 } 
                    tick={ <CustomizedXAxisTick data={ data } /> } 
                />

                <YAxis 
                    domain={ [ yTicks[ 0 ], yTicks[ yTicks.length -1 ] ] } 
                    ticks={ yTicks } 
                    interval={ 0 } 
                    tickFormatter={ x => withCommas( x ) } 
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
        </ResponsiveContainer>
    );
}

type TooltipPropsType = {
    active?: boolean
    payload?: any
    label?: string
} 

const CustomTooltip = ( { active, payload, label }: TooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        const { time, quantity, diff } = payload[ 0 ].payload;

        return (
            <div className="Tooltip">
                <p>{ `${timeLabel( time )}: ${time}` }</p>
                <p>{ `Αποθέματα: ${withCommas( quantity )}` } m<sup>3</sup></p>
                <p>{ `Διαφορά: ${withPlusSign( diff )}%` }</p>
            </div>
      );
    }
  
    return null;
};

export default ChartContent;