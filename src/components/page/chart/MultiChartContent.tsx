"use client"

import { LineChart, Line } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, Customized  } from 'recharts';
import { ResponsiveContainer } from 'recharts';

import { TopTitle, XAxisLabel, YAxisLabel } from '@/components/page/chart/labels';
import { XAxisTick, YAxisTick } from '@/components/page/chart/ticks';
import { MultiTooltip } from '@/components/page/chart/tooltips';
import { StandardLegend } from "@/components/page/chart/legends";
import { MultiChartLayoutHandler } from '@/logic/LayoutHandler/chart/_abstract';

import "@/styles/chart.css";

type PropsType = { 
    chartType: string | undefined
    layoutHandler: MultiChartLayoutHandler
}

const ChartContent = ( { chartType, layoutHandler }: PropsType ) => {

    console.log( "rendering: ChartContent..." )// , layoutSpecifier );

    return (
        <div className="ChartContent">

            { chartType === 'bar'
            ?
            <BarChartComposition
                layoutHandler={ layoutHandler }
            />

            :
            chartType === 'area'
            ?
            <AreaChartComposition
                layoutHandler={ layoutHandler }
            />

            :
            <LineChartComposition
                layoutHandler={ layoutHandler }
            />
            }
        </div>
    );
}

type ChartCompositionPropsType = { 
    layoutHandler: MultiChartLayoutHandler
}

const LineChartComposition = ( { layoutHandler }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={ layoutHandler.data }
                margin={{ top: 60, right: 20, bottom:60, left: 40 }}
            >
                <Customized
                    component={<TopTitle title={ layoutHandler.title } />}
                />
                
                <CartesianGrid 
                    strokeDasharray="1 1" 
                />

                <XAxis 
                    dataKey={ layoutHandler.xValueHandler.key }
                    ticks={ layoutHandler.xTicks } 
                    interval={ 0 } 
                    tick={ <XAxisTick data={ layoutHandler.data } /> }
                    label={ <XAxisLabel label={ layoutHandler.xLabel } /> }
                />

                <YAxis 
                    domain={ [ layoutHandler.minYTick, layoutHandler.maxYTick ] } 
                    ticks={ layoutHandler.yTicks }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ layoutHandler.data } /> }
                    label={ <YAxisLabel label={ layoutHandler.yLabel } /> }
                />

                <Tooltip 
                    content={ <MultiTooltip 
                        layoutHandler={ layoutHandler }
                    /> } 
                />

                <>
                { layoutHandler.yValueHandlers.map( ( handler, i ) => {
                    return (
                        <Line
                            key={ i }
                            dataKey={ handler.key }
                            type={ layoutHandler.lineType } 
                            stroke={ handler.color[ 500 ] } 
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
                    content={ <StandardLegend 
                        labels={ layoutHandler.yValueHandlers.map( h => h.label ) }
                        colors={ layoutHandler.yValueHandlers.map( h => h.color[ 500 ] ) }
                    /> }
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

const AreaChartComposition = ( { layoutHandler }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={ layoutHandler.data }
                margin={{ top: 60, right: 20, bottom:60, left: 40 }}
            >
                <Customized
                    component={<TopTitle title={ layoutHandler.title } />}
                />

                <CartesianGrid 
                    strokeDasharray="1 1" 
                />

                <XAxis 
                    dataKey={ layoutHandler.xValueHandler.key }
                    ticks={ layoutHandler.xTicks }
                    interval={ 0 } 
                    tick={ <XAxisTick data={ layoutHandler.data } /> } 
                    label={ <XAxisLabel label={ layoutHandler.xLabel } /> }
                />

                <YAxis 
                    domain={ [ layoutHandler.minYTick, layoutHandler.maxYTick ] } 
                    ticks={ layoutHandler.yTicks }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ layoutHandler.data } /> }
                    label={ <YAxisLabel label={ layoutHandler.yLabel } /> }
                />

                <Tooltip 
                    content={ <MultiTooltip 
                        layoutHandler={ layoutHandler }
                    /> } 
                />

                <>
                { layoutHandler.yValueHandlers.map( ( handler, i ) => {
                    return (
                        <Area 
                            key={ i }
                            dataKey={ handler.key }
                            type={ layoutHandler.lineType } 
                            stroke={ handler.color[ 400 ] } 
                            fill={ handler.color[ 300 ] } 
                            fillOpacity={ .65 } 
                        />
                    );
                } ) }
                </>

                <Legend 
                    align="right" 
                    verticalAlign='top' 
                    height={ 24 }
                    content={ <StandardLegend 
                        labels={ layoutHandler.yValueHandlers.map( h => h.label ) }
                        colors={ layoutHandler.yValueHandlers.map( h => h.color[ 500 ] ) }
                    /> }
                />

            </AreaChart>
        </ResponsiveContainer>
    );
}

const BarChartComposition = ( { layoutHandler }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={ layoutHandler.data }
                margin={{ top: 60, right: 20, bottom:60, left: 40 }}
            >
                <Customized
                    component={<TopTitle title={ layoutHandler.title } />}
                />

                <CartesianGrid 
                    strokeDasharray="1 1" 
                    vertical={ false } 
                />

                <XAxis 
                    dataKey={ layoutHandler.xValueHandler.key }
                    ticks={ layoutHandler.xTicks }
                    interval={ 0 } 
                    tick={ <XAxisTick data={ layoutHandler.data } /> } 
                    label={ <XAxisLabel label={ layoutHandler.xLabel } /> }
                />

                <YAxis 
                    domain={ [ layoutHandler.minYTick, layoutHandler.maxYTick ] } 
                    ticks={ layoutHandler.yTicks }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ layoutHandler.data } /> }
                    label={ <YAxisLabel label={ layoutHandler.yLabel } /> }
                />

                <Tooltip 
                    // cursor={{ fill: '#0369a1' }}
                    cursor={{ fill: '#eee' }}
                    content={ <MultiTooltip 
                        layoutHandler={ layoutHandler }
                    /> } 
                />

                <>
                { layoutHandler.yValueHandlers.map( ( handler, i ) => {
                    return (
                        <Bar 
                            key={ i }
                            dataKey={ handler.key }
                            stroke={ handler.color[ 400 ] } 
                            fill={ handler.color[ 300 ] } 
                            fillOpacity={ .65 } 
                        />
                    );
                } ) }
                </>

                <Legend 
                    align="right" 
                    verticalAlign='top' 
                    height={ 24 }
                    content={ <StandardLegend 
                        labels={ layoutHandler.yValueHandlers.map( h => h.label ) }
                        colors={ layoutHandler.yValueHandlers.map( h => h.color[ 500 ] ) }
                    /> }
                />

            </BarChart>
        </ResponsiveContainer>
    );
}

export default ChartContent;