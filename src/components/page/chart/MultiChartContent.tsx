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

import { MultiDataHandler } from '@/logic/DataHandler';
import { ChartHandler, ChartHandlerFactory } from '@/logic/ChartHandler';

import type { ObjectType } from '@/types';

import "@/styles/chart.css";

type PropsType = { 
    dataHandler: MultiDataHandler
    chartType: string | undefined
    layoutSpecifier: ObjectType
}

const ChartContent = ( { dataHandler, chartType, layoutSpecifier }: PropsType ) => {

    const chartHandler: ChartHandler = new ChartHandlerFactory( 
        'multi', 
        dataHandler.data, 
        dataHandler.specifierCollection 
    ).chartHandler;

    console.log( "rendering: ChartContent..." )// , layoutSpecifier );

    return (
        <div className="ChartContent">

            { chartType === 'bar'
            ?
            <BarChartComposition
                chartHandler={ chartHandler }
                layoutSpecifier={ layoutSpecifier }
            />

            :
            chartType === 'area'
            ?
            <AreaChartComposition
                chartHandler={ chartHandler }
                layoutSpecifier={ layoutSpecifier }
            />

            :
            <LineChartComposition
                chartHandler={ chartHandler }
                layoutSpecifier={ layoutSpecifier }
            />
            }
        </div>
    );
}

type ChartCompositionPropsType = { 
    chartHandler: ChartHandler
    layoutSpecifier: ObjectType
}

const LineChartComposition = ( { chartHandler, layoutSpecifier }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={ chartHandler.data }
                margin={{ top: 60, right: 20, bottom:60, left: 40 }}
            >
                <Customized
                    component={<TopTitle title={ layoutSpecifier.title } />}
                />
                
                <CartesianGrid 
                    strokeDasharray="1 1" 
                />

                <XAxis 
                    dataKey={ chartHandler.xValueKey }
                    ticks={ chartHandler.xTicks } 
                    interval={ 0 } 
                    tick={ <XAxisTick data={ chartHandler.data } /> }
                    label={ <XAxisLabel label={ layoutSpecifier.xLabel } /> }
                />

                <YAxis 
                    domain={ [ chartHandler.minYTick, chartHandler.maxYTick ] } 
                    ticks={ chartHandler.yTicks }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ chartHandler.data } /> }
                    label={ <YAxisLabel label={ layoutSpecifier.yLabel } /> }
                />

                <Tooltip 
                    content={ <MultiTooltip 
                        specifierCollection={ chartHandler.specifierCollection }
                    /> } 
                />

                <>
                { chartHandler.yValueKeys.map( ( key, i ) => {
                    return (
                        <Line
                            key={ i }
                            dataKey={ key }
                            type={ chartHandler.lineType } 
                            stroke={ layoutSpecifier.colors[ i ][ 500 ] } 
                            strokeWidth={ 2 } 
                            dot={ false }
                        />
                    );
                } ) }
                </>

                <Legend 
                    align="right" 
                    verticalAlign='top' 
                    height={ 24 }
                    content={ <MultiColorLegend 
                        colorsArray={ layoutSpecifier.colors }
                        specifierCollection={ chartHandler.specifierCollection }
                    /> }
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

const AreaChartComposition = ( { chartHandler, layoutSpecifier }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={ chartHandler.data }
                margin={{ top: 60, right: 20, bottom:60, left: 40 }}
            >
                <Customized
                    component={<TopTitle title={ layoutSpecifier.title } />}
                />

                <CartesianGrid 
                    strokeDasharray="1 1" 
                />

                <XAxis 
                    dataKey={ chartHandler.xValueKey }
                    ticks={ chartHandler.xTicks }
                    interval={ 0 } 
                    tick={ <XAxisTick data={ chartHandler.data } /> } 
                    label={ <XAxisLabel label={ layoutSpecifier.xLabel } /> }
                />

                <YAxis 
                    domain={ [ chartHandler.minYTick, chartHandler.maxYTick ] } 
                    ticks={ chartHandler.yTicks }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ chartHandler.data } /> }
                    label={ <YAxisLabel label={ layoutSpecifier.yLabel } /> }
                />

                <Tooltip 
                    content={ <MultiTooltip 
                        specifierCollection={ chartHandler.specifierCollection }
                    /> } 
                />

                <>
                { chartHandler.yValueKeys.map( ( key, i ) => {
                    return (
                        <Area 
                            key={ i }
                            dataKey={ key }
                            type={ chartHandler.lineType } 
                            stroke={ layoutSpecifier.colors[ i ][ 400 ] } 
                            fill={ layoutSpecifier.colors[ i ][ 300 ] } 
                            fillOpacity={ .65 } 
                        />
                    );
                } ) }
                </>

                <Legend 
                    align="right" 
                    verticalAlign='top' 
                    height={ 24 }
                    content={ <MultiColorLegend 
                        colorsArray={ layoutSpecifier.colors }
                        specifierCollection={ chartHandler.specifierCollection }
                    /> }
                />

            </AreaChart>
        </ResponsiveContainer>
    );
}

const BarChartComposition = ( { chartHandler, layoutSpecifier }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={ chartHandler.data }
                margin={{ top: 60, right: 20, bottom:60, left: 40 }}
            >
                <Customized
                    component={<TopTitle title={ layoutSpecifier.title } />}
                />

                <CartesianGrid 
                    strokeDasharray="1 1" 
                    vertical={ false } 
                />

                <XAxis 
                    dataKey={ chartHandler.xValueKey }
                    ticks={ chartHandler.xTicks }
                    interval={ 0 } 
                    tick={ <XAxisTick data={ chartHandler.data } /> } 
                    label={ <XAxisLabel label={ layoutSpecifier.xLabel } /> }
                />

                <YAxis 
                    domain={ [ chartHandler.minYTick, chartHandler.maxYTick ] } 
                    ticks={ chartHandler.yTicks }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ chartHandler.data } /> }
                    label={ <YAxisLabel label={ layoutSpecifier.yLabel } /> }
                />

                <Tooltip 
                    // cursor={{ fill: '#0369a1' }}
                    cursor={{ fill: '#eee' }}
                    content={ <MultiTooltip 
                        specifierCollection={ chartHandler.specifierCollection }
                    /> } 
                />

                <>
                { chartHandler.yValueKeys.map( ( key, i ) => {
                    return (
                        <Bar 
                            key={ i }
                            dataKey={ key }
                            stroke={ layoutSpecifier.colors[ i ][ 400 ] } 
                            fill={ layoutSpecifier.colors[ i ][ 300 ] } 
                            fillOpacity={ .65 } 
                        />
                    );
                } ) }
                </>

                <Legend 
                    align="right" 
                    verticalAlign='top' 
                    height={ 24 }
                    content={ <MultiColorLegend 
                        colorsArray={ layoutSpecifier.colors }
                        specifierCollection={ chartHandler.specifierCollection }
                    /> }
                />

            </BarChart>
        </ResponsiveContainer>
    );
}

export default ChartContent;