"use client"

import { LineChart, Line } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Customized, Label } from 'recharts';

import { CustomTitle } from '@/components/Page/Chart';
import { CustomizedXAxisTick, CustomizedYAxisTick } from '@/components/Page/Chart';
import { CustomizedYAxisLabel, CustomizedXAxisLabel } from '@/components/Page/Chart';
import { SimpleTooltip } from '@/components/Page/Chart/tooltips';

import { getAggregatedData, getLineType } from '@/logic/savings/_common';
import { getXTicks, getYTicks } from '@/logic/savings/chart';

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

    const data: ObjectType[] = getAggregatedData( result );
    const xTicks: string[] = getXTicks( data );
    const yTicks: number[] = getYTicks( data );
    const lineType: LineType = getLineType( xTicks );

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
                color={ SKY }
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
                color={ SKY }
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
                color={ SKY }
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
    color: ObjectType
    // aspect: number
    // onResize: CallableFunction
}

const LineChartComposition = ( { data, labels, xTicks, yTicks, lineType, color, aspect, onResize }: ChartCompositionPropsType ) => {

    // <ResponsiveContainer width="100%" height="100%" aspect={ aspect } onResize={ onResize } >

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={ data }
                margin={{ top: 60, right: 20, bottom:60, left: 40 }}
            >
                <Customized
                    component={<CustomTitle title={ labels.title } />}
                />
                
                <CartesianGrid 
                    strokeDasharray="1 1" 
                />

                <XAxis 
                    dataKey="time" 
                    ticks={ xTicks } 
                    interval={ 0 } 
                    tick={ <CustomizedXAxisTick data={ data } /> }
                    label={ <CustomizedXAxisLabel label={ labels.xLabel } /> }
                />

                <YAxis 
                    domain={ [ yTicks[ 0 ], yTicks[ yTicks.length - 1 ] ] } 
                    ticks={ yTicks } 
                    interval={ 0 } 
                    tick={ <CustomizedYAxisTick data={ data } /> }
                    label={ <CustomizedYAxisLabel label={ labels.yLabel } /> }
                />

                <Tooltip 
                    content={ <SimpleTooltip /> } 
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

const AreaChartComposition = ( { data, labels, xTicks, yTicks, lineType, color, aspect, onResize }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={ data }
                margin={{ top: 60, right: 20, bottom:60, left: 40 }}
            >
                <Customized
                    component={<CustomTitle title={ labels.title } />}
                />

                <CartesianGrid 
                    strokeDasharray="1 1" 
                />

                <XAxis 
                    dataKey="time" 
                    ticks={ xTicks } 
                    interval={ 0 } 
                    tick={ <CustomizedXAxisTick data={ data } /> } 
                    label={ <CustomizedXAxisLabel label={ labels.xLabel } /> }
                />

                <YAxis 
                    domain={ [ yTicks[ 0 ], yTicks[ yTicks.length -1 ] ] } 
                    ticks={ yTicks } 
                    interval={ 0 } 
                    tick={ <CustomizedYAxisTick data={ data } /> }
                    label={ <CustomizedYAxisLabel label={ labels.yLabel } /> }
                />

                <Tooltip 
                    content={ <SimpleTooltip /> } 
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

const BarChartComposition = ( { data, labels, xTicks, yTicks, lineType, color, aspect, onResize }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={ data }
                margin={{ top: 60, right: 20, bottom:60, left: 40 }}
            >
                <Customized
                    component={<CustomTitle title={ labels.title } />}
                />

                <CartesianGrid 
                    strokeDasharray="1 1" 
                    vertical={ false } 
                />

                <XAxis 
                    dataKey="time" 
                    ticks={ xTicks } 
                    interval={ 0 } 
                    tick={ <CustomizedXAxisTick data={ data } /> } 
                    label={ <CustomizedXAxisLabel label={ labels.xLabel } /> }
                />

                <YAxis 
                    domain={ [ yTicks[ 0 ], yTicks[ yTicks.length -1 ] ] } 
                    ticks={ yTicks } 
                    interval={ 0 } 
                    tick={ <CustomizedYAxisTick data={ data } /> }
                    label={ <CustomizedYAxisLabel label={ labels.yLabel } /> }
                />

                <Tooltip 
                    // cursor={{fill: 'transparent'}}
                    cursor={{ fill: '#0369a1' }}
                    content={ <SimpleTooltip /> } 
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

export default ChartContent;