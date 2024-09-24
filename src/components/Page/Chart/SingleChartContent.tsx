"use client"

import { LineChart, Line } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { XAxis, YAxis, CartesianGrid, Tooltip, Customized  } from 'recharts';
import { ResponsiveContainer } from 'recharts';

import { TopTitle, XAxisLabel, YAxisLabel } from '@/components/Page/Chart/labels';
import { XAxisTick, YAxisTick } from '@/components/Page/Chart/ticks';
import { SingleTooltip } from '@/components/Page/Chart/tooltips';

import { SingleDataHandler } from '@/logic/_common/DataHandler';
import { ChartHandler } from '@/logic/_common/ChartHandler';

import type { ObjectType } from '@/types';

import "@/styles/chart.css";

type PropsType = { 
    dataHandler: SingleDataHandler
    chartType: string | undefined
    chartLabels: ObjectType
}

const ChartContent = ( { dataHandler, chartType, chartLabels }: PropsType ) => {

    const chartHandler = new ChartHandler( dataHandler.data );

    console.log( "rendering: ChartContent..." )

    return (
        <div className="ChartContent">

            { chartType === 'bar'
            ?
            <BarChartComposition
                chartHandler={ chartHandler }
                labels={ chartLabels }
                color={ chartHandler.color }
            />

            :
            chartType === 'area'
            ?
            <AreaChartComposition
                chartHandler={ chartHandler }
                labels={ chartLabels }
                color={ chartHandler.color }
            />

            :
            <LineChartComposition
                chartHandler={ chartHandler }
                labels={ chartLabels }
                color={ chartHandler.color }
            />
            }
        </div>
    );
}

type ChartCompositionPropsType = { 
    chartHandler: ChartHandler
    labels: ObjectType
    color: ObjectType
}

const LineChartComposition = ( { chartHandler, labels }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={ chartHandler.data }
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
                    ticks={ chartHandler.xTicks } 
                    interval={ 0 } 
                    tick={ <XAxisTick data={ chartHandler.data } /> }
                    label={ <XAxisLabel label={ labels.xLabel } /> }
                />

                <YAxis 
                    domain={ [ chartHandler.minYTick, chartHandler.maxYTick ] } 
                    ticks={ chartHandler.yTicks }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ chartHandler.data } /> }
                    label={ <YAxisLabel label={ labels.yLabel } /> }
                />

                <Tooltip 
                    content={ <SingleTooltip /> } 
                />

                <Line 
                    dataKey="value"
                    type={ chartHandler.lineType } 
                    stroke={ chartHandler.color[ 500 ] } 
                    strokeWidth={ 2 } 
                    dot={ false }
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

const AreaChartComposition = ( { chartHandler, labels }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={ chartHandler.data }
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
                    ticks={ chartHandler.xTicks }
                    interval={ 0 } 
                    tick={ <XAxisTick data={ chartHandler.data } /> } 
                    label={ <XAxisLabel label={ labels.xLabel } /> }
                />

                <YAxis 
                    domain={ [ chartHandler.minYTick, chartHandler.maxYTick ] } 
                    ticks={ chartHandler.yTicks }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ chartHandler.data } /> }
                    label={ <YAxisLabel label={ labels.yLabel } /> }
                />

                <Tooltip 
                    content={ <SingleTooltip /> } 
                />

                <Area 
                    dataKey="value"
                    type={ chartHandler.lineType } 
                    stroke={ chartHandler.color[ 400 ] } 
                    fill={ chartHandler.color[ 300 ] } 
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

const BarChartComposition = ( { chartHandler, labels }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={ chartHandler.data }
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
                    ticks={ chartHandler.xTicks }
                    interval={ 0 } 
                    tick={ <XAxisTick data={ chartHandler.data } /> } 
                    label={ <XAxisLabel label={ labels.xLabel } /> }
                />

                <YAxis 
                    domain={ [ chartHandler.minYTick, chartHandler.maxYTick ] } 
                    ticks={ chartHandler.yTicks }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ chartHandler.data } /> }
                    label={ <YAxisLabel label={ labels.yLabel } /> }
                />

                <Tooltip 
                    cursor={{ fill: '#0369a1' }}
                    content={ <SingleTooltip /> } 
                />

                <Bar 
                    dataKey="value" 
                    stroke={ chartHandler.color[ 400 ] } 
                    fill={ chartHandler.color[ 300 ] } 
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default ChartContent;