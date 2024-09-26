"use client"

import { LineChart, Line } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { XAxis, YAxis, CartesianGrid, Tooltip, Customized  } from 'recharts';
import { ResponsiveContainer } from 'recharts';

import { TopTitle, XAxisLabel, YAxisLabel } from '@/components/page/chart/labels';
import { XAxisTick, YAxisTick } from '@/components/page/chart/ticks';
import { SingleTooltip } from '@/components/page/chart/tooltips';

import { SingleDataHandler } from '@/logic/DataHandler';
import { ChartHandler } from '@/logic/ChartHandler';

import type { ObjectType } from '@/types';

import "@/styles/chart.css";

type PropsType = { 
    dataHandler: SingleDataHandler
    chartType: string | undefined
    chartTexts: ObjectType
}

const ChartContent = ( { dataHandler, chartType, chartTexts }: PropsType ) => {

    const chartHandler = new ChartHandler( dataHandler.data );

    console.log( "rendering: ChartContent..." )

    return (
        <div className="ChartContent">

            { chartType === 'bar'
            ?
            <BarChartComposition
                chartHandler={ chartHandler }
                texts={ chartTexts }
            />

            :
            chartType === 'area'
            ?
            <AreaChartComposition
                chartHandler={ chartHandler }
                texts={ chartTexts }
            />

            :
            <LineChartComposition
                chartHandler={ chartHandler }
                texts={ chartTexts }
            />
            }
        </div>
    );
}

type ChartCompositionPropsType = { 
    chartHandler: ChartHandler
    texts: ObjectType
}

const LineChartComposition = ( { chartHandler, texts }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={ chartHandler.data }
                margin={{ top: 60, right: 20, bottom:60, left: 40 }}
            >
                <Customized
                    component={<TopTitle title={ texts.title } />}
                />
                
                <CartesianGrid 
                    strokeDasharray="1 1" 
                />

                <XAxis 
                    dataKey="time" 
                    ticks={ chartHandler.xTicks } 
                    interval={ 0 } 
                    tick={ <XAxisTick data={ chartHandler.data } /> }
                    label={ <XAxisLabel label={ texts.xLabel } /> }
                />

                <YAxis 
                    domain={ [ chartHandler.minYTick, chartHandler.maxYTick ] } 
                    ticks={ chartHandler.yTicks }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ chartHandler.data } /> }
                    label={ <YAxisLabel label={ texts.yLabel } /> }
                />

                <Tooltip 
                    content={ <SingleTooltip 
                        texts={ texts }
                    /> } 
                />

                <Line 
                    dataKey="value"
                    type={ chartHandler.lineType } 
                    stroke={ texts.color[ 500 ] } 
                    strokeWidth={ 2 } 
                    dot={ false }
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

const AreaChartComposition = ( { chartHandler, texts }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={ chartHandler.data }
                margin={{ top: 60, right: 20, bottom:60, left: 40 }}
            >
                <Customized
                    component={<TopTitle title={ texts.title } />}
                />

                <CartesianGrid 
                    strokeDasharray="1 1" 
                />

                <XAxis 
                    dataKey="time" 
                    ticks={ chartHandler.xTicks }
                    interval={ 0 } 
                    tick={ <XAxisTick data={ chartHandler.data } /> } 
                    label={ <XAxisLabel label={ texts.xLabel } /> }
                />

                <YAxis 
                    domain={ [ chartHandler.minYTick, chartHandler.maxYTick ] } 
                    ticks={ chartHandler.yTicks }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ chartHandler.data } /> }
                    label={ <YAxisLabel label={ texts.yLabel } /> }
                />

                <Tooltip 
                    content={ <SingleTooltip 
                        texts={ texts }
                    /> } 
                />

                <Area 
                    dataKey="value"
                    type={ chartHandler.lineType } 
                    stroke={ texts.color[ 400 ] } 
                    fill={ texts.color[ 300 ] } 
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

const BarChartComposition = ( { chartHandler, texts }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={ chartHandler.data }
                margin={{ top: 60, right: 20, bottom:60, left: 40 }}
            >
                <Customized
                    component={<TopTitle title={ texts.title } />}
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
                    label={ <XAxisLabel label={ texts.xLabel } /> }
                />

                <YAxis 
                    domain={ [ chartHandler.minYTick, chartHandler.maxYTick ] } 
                    ticks={ chartHandler.yTicks }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ chartHandler.data } /> }
                    label={ <YAxisLabel label={ texts.yLabel } /> }
                />

                <Tooltip 
                    // cursor={{ fill: '#0369a1' }}
                    cursor={{ fill: '#eee' }}
                    content={ <SingleTooltip 
                        texts={ texts }
                    /> } 
                />

                <Bar 
                    dataKey="value" 
                    stroke={ texts.color[ 400 ] } 
                    fill={ texts.color[ 300 ] } 
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default ChartContent;