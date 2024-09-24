"use client"

import { LineChart, Line } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Customized } from 'recharts';

import { TopTitle, XAxisLabel, YAxisLabel } from '@/components/Page/Chart/labels';
import { XAxisTick, YAxisTick } from '@/components/Page/Chart/ticks';
import { SimpleTooltip } from '@/components/Page/Chart/tooltips';

import { SavingsDataParser } from '@/logic/_common/DataParser';
import { ChartHandler } from '@/logic/_common/ChartHandler';

import type { ObjectType } from '@/types';
import type { RequestResultType } from "@/types/requestResult";

import "@/styles/chart.css";

type PropsType = { 
    result: RequestResultType | null
    chartType: string | undefined
    chartLabels: ObjectType
}

const ChartContent = ( { result, chartType, chartLabels }: PropsType ) => {

    const data: ObjectType[] = new SavingsDataParser( result ).getData();
    const chartHandler = new ChartHandler( data );

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
                data={ chartHandler.getData() }
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
                    ticks={ chartHandler.getXTicks() } 
                    interval={ 0 } 
                    tick={ <XAxisTick data={ chartHandler.getData() } /> }
                    label={ <XAxisLabel label={ labels.xLabel } /> }
                />

                <YAxis 
                    domain={ [ chartHandler.minYTick(), chartHandler.maxYTick() ] } 
                    ticks={ chartHandler.getYTicks() }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ chartHandler.getData() } /> }
                    label={ <YAxisLabel label={ labels.yLabel } /> }
                />

                <Tooltip 
                    content={ <SimpleTooltip /> } 
                />

                <Line 
                    dataKey="quantity"
                    type={ chartHandler.getLineType() } 
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
                data={ chartHandler.getData() }
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
                    ticks={ chartHandler.getXTicks() }
                    interval={ 0 } 
                    tick={ <XAxisTick data={ chartHandler.getData() } /> } 
                    label={ <XAxisLabel label={ labels.xLabel } /> }
                />

                <YAxis 
                    domain={ [ chartHandler.minYTick(), chartHandler.maxYTick() ] } 
                    ticks={ chartHandler.getYTicks() }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ chartHandler.getData() } /> }
                    label={ <YAxisLabel label={ labels.yLabel } /> }
                />

                <Tooltip 
                    content={ <SimpleTooltip /> } 
                />

                <Area 
                    dataKey="quantity"
                    type={ chartHandler.getLineType() } 
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
                data={ chartHandler.getData() }
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
                    ticks={ chartHandler.getXTicks() }
                    interval={ 0 } 
                    tick={ <XAxisTick data={ chartHandler.getData() } /> } 
                    label={ <XAxisLabel label={ labels.xLabel } /> }
                />

                <YAxis 
                    domain={ [ chartHandler.minYTick(), chartHandler.maxYTick() ] } 
                    ticks={ chartHandler.getYTicks() }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ chartHandler.getData() } /> }
                    label={ <YAxisLabel label={ labels.yLabel } /> }
                />

                <Tooltip 
                    cursor={{ fill: '#0369a1' }}
                    content={ <SimpleTooltip /> } 
                />

                <Bar 
                    dataKey="quantity" 
                    stroke={ chartHandler.color[ 400 ] } 
                    fill={ chartHandler.color[ 300 ] } 
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default ChartContent;