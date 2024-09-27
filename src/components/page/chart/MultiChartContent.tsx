"use client"

import { LineChart, Line } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, Customized  } from 'recharts';
import { ResponsiveContainer } from 'recharts';

import { TopTitle, XAxisLabel, YAxisLabel } from '@/components/page/chart/labels';
import { XAxisTick, YAxisTick } from '@/components/page/chart/ticks';
import { MultiTooltip } from '@/components/page/chart/tooltips';
import { MultiColorLegend } from "@/components/page/chart/legends";

import { SingleDataHandler } from '@/logic/DataHandler';
import { ChartHandler, ChartHandlerFactory } from '@/logic/ChartHandler';

import type { ObjectType } from '@/types';

import "@/styles/chart.css";

type PropsType = { 
    dataHandler: SingleDataHandler
    chartType: string | undefined
    chartTexts: ObjectType
}

const ChartContent = ( { dataHandler, chartType, chartTexts }: PropsType ) => {

    const valueKeys: string[] = dataHandler.headers.slice( 1 );
    const chartHandler: ChartHandler = new ChartHandlerFactory( 'multi', dataHandler.data, valueKeys ).chartHandler;

    console.log( "rendering: ChartContent...", chartHandler.toJSON() );

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
                    content={ <MultiTooltip 
                        valueKeys={ chartHandler.valueKeys } 
                    /> } 
                />

                <Line
                    dataKey={ chartHandler.valueKeys[ 0 ] }
                    type={ chartHandler.lineType } 
                    stroke={ texts.colors[ 0 ][ 500 ] } 
                    strokeWidth={ 2 } 
                    dot={ false }
                />
                <Line
                    dataKey={ chartHandler.valueKeys[ 1 ] }
                    type={ chartHandler.lineType } 
                    stroke={ texts.colors[ 1 ][ 500 ] } 
                    strokeWidth={ 2 } 
                    dot={ false }
                />

                <Legend 
                    align="right" 
                    verticalAlign='top' 
                    height={ 24 }
                    content={ <MultiColorLegend 
                        valueKeys={ chartHandler.valueKeys }
                        colorsArray={ texts.colors }
                    /> }
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
                    content={ <MultiTooltip 
                        valueKeys={ chartHandler.valueKeys } 
                    /> } 
                />

                <Area 
                    dataKey={ chartHandler.valueKeys[ 0 ] }
                    type={ chartHandler.lineType } 
                    stroke={ texts.colors[ 0 ][ 400 ] } 
                    fill={ texts.colors[ 0 ][ 300 ] } 
                />

                <Area 
                    dataKey={ chartHandler.valueKeys[ 1 ] }
                    type={ chartHandler.lineType } 
                    stroke={ texts.colors[ 1 ][ 400 ] } 
                    fill={ texts.colors[ 1 ][ 300 ] } 
                />

                <Legend 
                    align="right" 
                    verticalAlign='top' 
                    height={ 24 }
                    content={ <MultiColorLegend 
                        valueKeys={ chartHandler.valueKeys }
                        colorsArray={ texts.colors }
                    /> }
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
                    content={ <MultiTooltip 
                        valueKeys={ chartHandler.valueKeys } 
                    /> } 
                />

                <Bar 
                    dataKey={ chartHandler.valueKeys[ 0 ] }
                    stroke={ texts.colors[ 0 ][ 400 ] } 
                    fill={ texts.colors[ 0 ][ 300 ] } 
                />
                <Bar 
                    dataKey={ chartHandler.valueKeys[ 1 ] }
                    stroke={ texts.colors[ 1 ][ 400 ] } 
                    fill={ texts.colors[ 1 ][ 300 ] } 
                />

                <Legend 
                    align="right" 
                    verticalAlign='top' 
                    height={ 24 }
                    content={ <MultiColorLegend 
                        valueKeys={ chartHandler.valueKeys }
                        colorsArray={ texts.colors }
                    /> }
                />

            </BarChart>
        </ResponsiveContainer>
    );
}

export default ChartContent;