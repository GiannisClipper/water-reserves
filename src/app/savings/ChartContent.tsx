"use client"

import { useState } from 'react';
import { LineChart, Line } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { BarChart, Bar, Rectangle } from 'recharts';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

import { CustomizedXAxisTick } from '@/components/Page/Chart';

import { getAggregatedData, getLineType } from '@/logic/savings/_common';
import { getXTicks, getYTicks } from '@/logic/savings/chart';

import { withCommas, withPlusSign } from '@/helpers/numbers';
import { timeLabel } from '@/helpers/time';
import { SKY } from '@/helpers/colors';
import { setFunctionOnDelay } from "@/helpers/time";
import { getAspect } from "@/logic/_common/chart";

import type { ObjectType } from '@/types';
import type { LineType } from '@/logic/savings/_common';
import type { RequestResultType } from "@/types/requestResult";

import "@/styles/chart.css";

type PropsType = { 
    result: RequestResultType | null
    chartType: string | undefined
}

const ChartContent = ( { result, chartType }: PropsType ) => {

    const data: ObjectType[] = getAggregatedData( result );
    const xTicks: string[] = getXTicks( data );
    const yTicks: number[] = getYTicks( data );
    const lineType: LineType = getLineType( xTicks );

    const [ aspect, setAspect ] = useState( 0 );
    const onResize = setFunctionOnDelay( () => getAspect( aspect, setAspect ), 100 );

    console.log( "rendering: ChartContent..." )
    console.log( 'data, xTicks, yTicks', data, xTicks, yTicks )

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
                aspect={ aspect }
                onResize={ onResize }
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
                aspect={ aspect }
                onResize={ onResize }
            />

            :
            <LineChartComposition
                data={ data }
                xTicks={ xTicks }
                yTicks={ yTicks }
                lineType={ lineType }
                color={ SKY }
                aspect={ aspect }
                onResize={ onResize }
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
    aspect: number
    onResize: CallableFunction
}

const LineChartComposition = ( { data, xTicks, yTicks, lineType, color, aspect, onResize }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%" aspect={ aspect } onResize={ onResize } >
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

const AreaChartComposition = ( { data, xTicks, yTicks, lineType, color, aspect, onResize }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%" aspect={ aspect } onResize={ onResize } >
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

const BarChartComposition = ( { data, xTicks, yTicks, lineType, color, aspect, onResize }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%" aspect={ aspect } onResize={ onResize } >
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

        const { time, quantity, diff, percent } = payload[ 0 ].payload;

        return (
            <div className="Tooltip">
                <p>{ `${timeLabel( time )}: ${time}` }</p>
                <p>{ `Αποθέματα: ${withCommas( quantity )}` } m<sup>3</sup></p>
                <p>{ `Διαφορά: ${withCommas( diff )} (${withPlusSign( percent )}%)` }</p>
            </div>
      );
    }
  
    return null;
};

export default ChartContent;