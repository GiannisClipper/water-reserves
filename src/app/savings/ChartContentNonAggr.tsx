"use client"

import { useState } from "react";
import { LineChart, Line, Legend } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { BarChart, Bar, Rectangle } from 'recharts';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Customized, Label } from 'recharts';

import { TopTitle, XAxisLabel, YAxisLabel } from '@/components/Page/Chart/labels';
import { XAxisTick, YAxisTick } from '@/components/Page/Chart/ticks';
import { ComplexTooltip } from '@/components/Page/Chart/tooltips';
import { LineLegend, ColorLegend } from "@/components/Page/Chart/legends";

import { getXTicks, getYTicks } from '@/logic/savings/chart';
import { getLineType } from '@/logic/savings/_common';
import { getReservoirs, getNonAggregatedData } from '@/logic/savings/_common';
import { makeReservoirsRepr, makeReservoirsOrderedRepr } from '@/logic/savings/chart';

import ObjectList from '@/helpers/objects/ObjectList';
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
    chartLabels: ObjectType
}

const ChartContent = ( { result, chartType, chartLabels }: PropsType ) => {
    
    const data = getNonAggregatedData( result );
    let reservoirs: ObjectType[] = getReservoirs( result, data );
    // sortBy start: chart lines will be displayed from bottom to top (most recent reservoir on top)
    reservoirs = new ObjectList( reservoirs ).sortBy( 'start', 'asc' );

    const xTicks: string[] = getXTicks( data );
    const yTicks: number[] = getYTicks( data );
    const lineType: LineType = getLineType( xTicks );

    const colorArray: string[] = [ SKY[ 600 ], SKY[ 500 ], SKY[ 400 ], SKY[ 300 ] ];

    // const [ aspect, setAspect ] = useState( 0 );
    // const onResize = setFunctionOnDelay( () => getAspect( aspect, setAspect ), 100 );

    console.log( "rendering: ChartContent..." ) 
    console.log( 'data, xTicks, yTicks', data, xTicks, yTicks )

    return (
        <div className="ChartContent">

            { chartType === 'bar'
            ?
            <BarChartComposition
                data={ data }
                labels={ chartLabels }
                xTicks={ xTicks }
                yTicks={ yTicks }
                lineType={ lineType }
                colorArray={ colorArray }
                reservoirs={ reservoirs }
                // aspect={ aspect }
                // onResize={ onResize }
            />

            :
            chartType === 'area'
            ?
            <AreaChartComposition
                data={ data }
                labels={ chartLabels }
                xTicks={ xTicks }
                yTicks={ yTicks }
                lineType={ lineType }
                colorArray={ colorArray }
                reservoirs={ reservoirs }
                // aspect={ aspect }
                // onResize={ onResize }
            />

            :
            <LineChartComposition
                data={ data }
                labels={ chartLabels }
                xTicks={ xTicks }
                yTicks={ yTicks }
                lineType={ lineType }
                colorArray={ colorArray }
                reservoirs={ reservoirs }
                // aspect={ aspect }
                // onResize={ onResize }
            />
            }
                
        </div>
    );
}

type ChartCompositionPropsType = { 
    data: ObjectType[]
    labels: ObjectType
    xTicks: string[]
    yTicks: number[]
    lineType: LineType
    colorArray: string[]
    reservoirs: ObjectType[]
    // aspect: number
    // onResize: CallableFunction
}

const LineChartComposition = ( { data, labels, xTicks, yTicks, lineType, colorArray, reservoirs, aspect, onResize }: ChartCompositionPropsType ) => {

    const lineDashes: string[] = [ "1 1", "2 2", "4 4", "8 8" ];

    console.log( 'Rerender LineChart...' );

    // <ResponsiveContainer width="100%" height="100%" aspect={ aspect } onResize={ onResize } >

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={ data }
                margin={{ top: 60, right: 20, bottom:60, left: 40 }}
            >
                <Customized
                    component={<TopTitle title={ labels.title } />}
                />

                <CartesianGrid 
                    strokeDasharray="1 1" 
                />

                <XAxis 
                    dataKey="time" 
                    ticks={ xTicks } 
                    interval={ 0 } 
                    tick={ <XAxisTick data={ data } /> } 
                    label={ <XAxisLabel label={ labels.xLabel } /> }
                />

                <YAxis 
                    domain={ [ yTicks[ 0 ], yTicks[ yTicks.length - 1 ] ] } 
                    ticks={ yTicks } 
                    interval={ 0 } 
                    tick={ <YAxisTick data={ data } /> }
                    label={ <YAxisLabel label={ labels.yLabel } /> }
                />

                <Tooltip 
                    content={ 
                        <ComplexTooltip 
                            reservoirs={ reservoirs } 
                            makeReservoirsRepr={ makeReservoirsOrderedRepr }
                        /> 
                    } 
                />

                { reservoirs.map( ( r, i ) =>
                    <Line 
                        key={ i }
                        id={ `${i+1}`} 
                        type={ lineType } 
                        dataKey={ `quantities.${r.id}.quantity` }
                        stroke={ colorArray[ 0 ] } 
                        strokeWidth={ 2 } 
                        strokeDasharray={ lineDashes[ i ] }
                        dot={ false }
                        legendType="plainline"
                    />
                ) }

                <Line 
                    id="0" 
                    type={ lineType } 
                    dataKey="total"
                    stroke={ colorArray[ 0 ] } 
                    strokeWidth={ 2 }
                    dot={ false }
                    legendType="plainline"
                />

                <Legend 
                    align="right" 
                    verticalAlign='top'
                    height={ 24 }
                    content={ <LineLegend 
                        reservoirs={ reservoirs }
                        colorsArray={ colorArray }
                        strokeDasharray={ lineDashes }
                    /> }
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

const AreaChartComposition = ( { data, labels, xTicks, yTicks, lineType, colorArray, reservoirs, aspect, onResize }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={ data }
                // stackOffset="expand"
                margin={{ top: 60, right: 20, bottom:60, left: 40 }}
            >
                <Customized
                    component={<TopTitle title={ labels.title } />}
                />

                <CartesianGrid 
                    strokeDasharray="1 1" 
                />

                <XAxis 
                    dataKey="time" 
                    ticks={ xTicks } 
                    interval={ 0 } 
                    tick={ <XAxisTick data={ data } /> } 
                    label={ <XAxisLabel label={ labels.xLabel } /> }
                />

                <YAxis 
                    domain={ [ yTicks[ 0 ], yTicks[ yTicks.length -1 ] ] } 
                    ticks={ yTicks } 
                    interval={ 0 } 
                    tick={ <YAxisTick data={ data } /> }
                    label={ <YAxisLabel label={ labels.yLabel } /> }
                />

                <Tooltip 
                    content={ 
                        <ComplexTooltip 
                            reservoirs={ reservoirs } 
                            makeReservoirsRepr={ makeReservoirsRepr }
                        /> 
                    } 
                />

                { reservoirs.map( ( r, i ) =>
                    <Area 
                        key={ i } 
                        type={ lineType } 
                        dataKey={ `quantities.${r.id}.quantity` }
                        stackId="a"
                        stroke={ colorArray[ i ] } 
                        fill={ colorArray[ i ] } 
                        fillOpacity={ .65 } 
                    />
                ) }

                <Legend 
                    align="right" 
                    verticalAlign='top' 
                    height={ 24 }
                    content={ <ColorLegend 
                        reservoirs={ reservoirs }
                        colorsArray={ colorArray }
                    /> }
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

const BarChartComposition = ( { data, labels, xTicks, yTicks, lineType, colorArray, reservoirs, aspect, onResize }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={ data }
                margin={{ top: 60, right: 20, bottom:60, left: 40 }}
            >
                <Customized
                    component={<TopTitle title={ labels.title } />}
                />

                <CartesianGrid 
                    strokeDasharray="1 1" 
                    vertical={ false } 
                />

                <XAxis 
                    dataKey="time" 
                    ticks={ xTicks } 
                    interval={ 0 } 
                    tick={ <XAxisTick data={ data } /> } 
                    label={ <XAxisLabel label={ labels.xLabel } /> }
                />

                <YAxis 
                    domain={ [ yTicks[ 0 ], yTicks[ yTicks.length -1 ] ] } 
                    ticks={ yTicks } 
                    interval={ 0 } 
                    tick={ <YAxisTick data={ data } /> }
                    label={ <YAxisLabel label={ labels.yLabel } /> }
                />

                <Tooltip 
                    cursor={{ fill: '#0369a1' }}
                    content={ 
                        <ComplexTooltip 
                            reservoirs={ reservoirs } 
                            makeReservoirsRepr={ makeReservoirsRepr }
                        /> 
                    } 
                />

                { reservoirs.map( ( r, i ) =>
                    <Bar 
                        key={ i } 
                        type={ lineType } 
                        dataKey={ `quantities.${r.id}.quantity` }
                        stackId="a"
                        fill={ colorArray[ i ] } 
                        fillOpacity={ 1 }
                    />
                ) }

                <Legend 
                    align="right" 
                    verticalAlign='top' 
                    height={ 24 }
                    content={ <ColorLegend 
                        reservoirs={ reservoirs }
                        colorsArray={ colorArray }
                    /> }
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default ChartContent;