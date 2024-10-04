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
    metadataHandler: ObjectType
}

const ChartContent = ( { dataHandler, chartType, metadataHandler }: PropsType ) => {

    const valueKeys: string[] = dataHandler.valueKeys;
    const chartHandler: ChartHandler = new ChartHandlerFactory( 'multi', dataHandler.data, valueKeys ).chartHandler;

    console.log( "rendering: ChartContent..." )//, dataHandler );

    return (
        <div className="ChartContent">

            { chartType === 'bar'
            ?
            <BarChartComposition
                chartHandler={ chartHandler }
                metadataHandler={ metadataHandler }
            />

            :
            chartType === 'area'
            ?
            <AreaChartComposition
                chartHandler={ chartHandler }
                metadataHandler={ metadataHandler }
            />

            :
            <LineChartComposition
                chartHandler={ chartHandler }
                metadataHandler={ metadataHandler }
            />
            }
        </div>
    );
}

type ChartCompositionPropsType = { 
    chartHandler: ChartHandler
    metadataHandler: ObjectType
}

const LineChartComposition = ( { chartHandler, metadataHandler }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={ chartHandler.data }
                margin={{ top: 60, right: 20, bottom:60, left: 40 }}
            >
                <Customized
                    component={<TopTitle title={ metadataHandler.title } />}
                />
                
                <CartesianGrid 
                    strokeDasharray="1 1" 
                />

                <XAxis 
                    dataKey="time" 
                    ticks={ chartHandler.xTicks } 
                    interval={ 0 } 
                    tick={ <XAxisTick data={ chartHandler.data } /> }
                    label={ <XAxisLabel label={ metadataHandler.xLabel } /> }
                />

                <YAxis 
                    domain={ [ chartHandler.minYTick, chartHandler.maxYTick ] } 
                    ticks={ chartHandler.yTicks }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ chartHandler.data } /> }
                    label={ <YAxisLabel label={ metadataHandler.yLabel } /> }
                />

                <Tooltip 
                    content={ <MultiTooltip 
                        valueKeys={ chartHandler.valueKeys } 
                    /> } 
                />

                <>
                { chartHandler.valueKeys.map( ( key, i ) => {
                    return (
                        <Line
                            key={ i }
                            dataKey={ key }
                            type={ chartHandler.lineType } 
                            stroke={ metadataHandler.colors[ i ][ 500 ] } 
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
                        colorsArray={ metadataHandler.colors }
                        valueLabels={ metadataHandler.valueLabels }
                    /> }
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

const AreaChartComposition = ( { chartHandler, metadataHandler }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={ chartHandler.data }
                margin={{ top: 60, right: 20, bottom:60, left: 40 }}
            >
                <Customized
                    component={<TopTitle title={ metadataHandler.title } />}
                />

                <CartesianGrid 
                    strokeDasharray="1 1" 
                />

                <XAxis 
                    dataKey="time" 
                    ticks={ chartHandler.xTicks }
                    interval={ 0 } 
                    tick={ <XAxisTick data={ chartHandler.data } /> } 
                    label={ <XAxisLabel label={ metadataHandler.xLabel } /> }
                />

                <YAxis 
                    domain={ [ chartHandler.minYTick, chartHandler.maxYTick ] } 
                    ticks={ chartHandler.yTicks }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ chartHandler.data } /> }
                    label={ <YAxisLabel label={ metadataHandler.yLabel } /> }
                />

                <Tooltip 
                    content={ <MultiTooltip 
                        valueKeys={ chartHandler.valueKeys } 
                    /> } 
                />

                <>
                { chartHandler.valueKeys.map( ( key, i ) => {
                    return (
                        <Area 
                            key={ i }
                            dataKey={ key }
                            type={ chartHandler.lineType } 
                            stroke={ metadataHandler.colors[ i ][ 400 ] } 
                            fill={ metadataHandler.colors[ i ][ 300 ] } 
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
                        colorsArray={ metadataHandler.colors }
                        valueLabels={ metadataHandler.valueLabels }
                    /> }
                />

            </AreaChart>
        </ResponsiveContainer>
    );
}

const BarChartComposition = ( { chartHandler, metadataHandler }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={ chartHandler.data }
                margin={{ top: 60, right: 20, bottom:60, left: 40 }}
            >
                <Customized
                    component={<TopTitle title={ metadataHandler.title } />}
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
                    label={ <XAxisLabel label={ metadataHandler.xLabel } /> }
                />

                <YAxis 
                    domain={ [ chartHandler.minYTick, chartHandler.maxYTick ] } 
                    ticks={ chartHandler.yTicks }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ chartHandler.data } /> }
                    label={ <YAxisLabel label={ metadataHandler.yLabel } /> }
                />

                <Tooltip 
                    // cursor={{ fill: '#0369a1' }}
                    cursor={{ fill: '#eee' }}
                    content={ <MultiTooltip 
                        valueKeys={ chartHandler.valueKeys } 
                    /> } 
                />

<>
                { chartHandler.valueKeys.map( ( key, i ) => {
                    return (
                        <Bar 
                            key={ i }
                            dataKey={ key }
                            stroke={ metadataHandler.colors[ i ][ 400 ] } 
                            fill={ metadataHandler.colors[ i ][ 300 ] } 
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
                        colorsArray={ metadataHandler.colors }
                        valueLabels={ metadataHandler.valueLabels }
                    /> }
                />

            </BarChart>
        </ResponsiveContainer>
    );
}

export default ChartContent;