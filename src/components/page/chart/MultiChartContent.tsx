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
import { MultiChartLayoutHandler } from '@/logic/LayoutHandler/chart';

import MultiDataHandler from '@/logic/DataHandler';
import { ChartHandler, ChartHandlerFactory } from '@/logic/ChartHandler';

import "@/styles/chart.css";
import { handleClientScriptLoad } from 'next/script';

type PropsType = { 
    dataHandler: MultiDataHandler
    chartType: string | undefined
    layoutHandler: MultiChartLayoutHandler
}

const ChartContent = ( { dataHandler, chartType, layoutHandler }: PropsType ) => {

    const chartHandler: ChartHandler = new ChartHandlerFactory( {
        type: 'multi', 
        data : dataHandler.data, 
        legend: dataHandler.legend || {}, 
        specifierCollection: dataHandler.specifierCollection
    } ).chartHandler;

    console.log( "rendering: ChartContent..." )// , layoutSpecifier );

    return (
        <div className="ChartContent">

            { chartType === 'bar'
            ?
            <BarChartComposition
                chartHandler={ chartHandler }
                layoutHandler={ layoutHandler }
            />

            :
            chartType === 'area'
            ?
            <AreaChartComposition
                chartHandler={ chartHandler }
                layoutHandler={ layoutHandler }
            />

            :
            <LineChartComposition
                chartHandler={ chartHandler }
                layoutHandler={ layoutHandler }
            />
            }
        </div>
    );
}

type ChartCompositionPropsType = { 
    chartHandler: ChartHandler
    layoutHandler: MultiChartLayoutHandler
}

const LineChartComposition = ( { chartHandler, layoutHandler }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={ chartHandler.data }
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
                    ticks={ chartHandler.xTicks } 
                    interval={ 0 } 
                    tick={ <XAxisTick data={ chartHandler.data } /> }
                    label={ <XAxisLabel label={ layoutHandler.xLabel } /> }
                />

                <YAxis 
                    domain={ [ chartHandler.minYTick, chartHandler.maxYTick ] } 
                    ticks={ chartHandler.yTicks }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ chartHandler.data } /> }
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
                            type={ chartHandler.lineType } 
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
                    content={ <MultiColorLegend 
                        colorsArray={ layoutHandler.yValueHandlers.map( handler => handler.color ) }
                        specifierCollection={ chartHandler.specifierCollection }
                    /> }
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

const AreaChartComposition = ( { chartHandler, layoutHandler }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={ chartHandler.data }
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
                    ticks={ chartHandler.xTicks }
                    interval={ 0 } 
                    tick={ <XAxisTick data={ chartHandler.data } /> } 
                    label={ <XAxisLabel label={ layoutHandler.xLabel } /> }
                />

                <YAxis 
                    domain={ [ chartHandler.minYTick, chartHandler.maxYTick ] } 
                    ticks={ chartHandler.yTicks }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ chartHandler.data } /> }
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
                            type={ chartHandler.lineType } 
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
                    content={ <MultiColorLegend 
                        colorsArray={ layoutHandler.yValueHandlers.map( handler => handler.color ) }
                        specifierCollection={ chartHandler.specifierCollection }
                    /> }
                />

            </AreaChart>
        </ResponsiveContainer>
    );
}

const BarChartComposition = ( { chartHandler, layoutHandler }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={ chartHandler.data }
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
                    ticks={ chartHandler.xTicks }
                    interval={ 0 } 
                    tick={ <XAxisTick data={ chartHandler.data } /> } 
                    label={ <XAxisLabel label={ layoutHandler.xLabel } /> }
                />

                <YAxis 
                    domain={ [ chartHandler.minYTick, chartHandler.maxYTick ] } 
                    ticks={ chartHandler.yTicks }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ chartHandler.data } /> }
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
                    content={ <MultiColorLegend 
                        colorsArray={ layoutHandler.yValueHandlers.map( handler => handler.color ) }
                        specifierCollection={ chartHandler.specifierCollection }
                    /> }
                />

            </BarChart>
        </ResponsiveContainer>
    );
}

export default ChartContent;