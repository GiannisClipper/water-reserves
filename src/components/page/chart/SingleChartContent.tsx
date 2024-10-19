"use client"

import { LineChart, Line } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { XAxis, YAxis, CartesianGrid, Tooltip, Customized  } from 'recharts';
import { ResponsiveContainer } from 'recharts';

import { TopTitle, XAxisLabel, YAxisLabel } from '@/components/page/chart/labels';
import { XAxisTick, YAxisTick } from '@/components/page/chart/ticks';
import { SingleTooltip } from '@/components/page/chart/tooltips';

import SingleDataHandler from '@/logic/DataHandler/SingleDataHandler';
import { ChartHandler, ChartHandlerFactory } from '@/logic/ChartHandler';

import type { ObjectType } from '@/types';

import "@/styles/chart.css";

type PropsType = { 
    chartType: string | undefined
    dataHandler: SingleDataHandler
    layoutSpecifier: ObjectType
}

const ChartContent = ( { chartType, dataHandler, layoutSpecifier }: PropsType ) => {

    console.log( "rendering: ChartContent..." )//, dataHandler.data )

    const chartHandler: ChartHandler = new ChartHandlerFactory( 
        'single', 
        dataHandler.data, 
        dataHandler.specifierCollection 
    ).chartHandler;

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
                    content={ <SingleTooltip 
                        specifierCollection={ chartHandler.specifierCollection }
                    /> } 
                />

                <Line
                    dataKey={ chartHandler.yValueKey }
                    type={ chartHandler.lineType } 
                    stroke={ layoutSpecifier.colors[ 0 ][ 500 ] } 
                    strokeWidth={ 2 } 
                    dot={ false }
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
                    content={ <SingleTooltip 
                        specifierCollection={ chartHandler.specifierCollection }
                    /> } 
                />

                <Area 
                    dataKey={ chartHandler.yValueKey }
                    type={ chartHandler.lineType } 
                    stroke={ layoutSpecifier.colors[ 0 ][ 400 ] } 
                    fill={ layoutSpecifier.colors[ 0 ][ 300 ] } 
                    fillOpacity={ .65 } 
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
                    content={ <SingleTooltip 
                        specifierCollection={ chartHandler.specifierCollection }
                    /> } 
                />

                <Bar 
                    dataKey={ chartHandler.yValueKey }
                    stroke={ layoutSpecifier.colors[ 0 ][ 400 ] } 
                    fill={ layoutSpecifier.colors[ 0 ][ 300 ] } 
                    fillOpacity={ .65 } 
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default ChartContent;