"use client"

import { LineChart, Line } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, Customized  } from 'recharts';
import { ResponsiveContainer } from 'recharts';

import { TopTitle, XAxisLabel, YAxisLabel } from '@/components/page/chart/labels';
import { XAxisTick, YAxisTick } from '@/components/page/chart/ticks';
import { StackTooltip } from '@/components/page/chart/tooltips';
import { LineLegend, ColorLegend } from "@/components/page/chart/legends";

import { StackDataHandler } from '@/logic/DataHandler';
import { ChartHandler } from "@/logic/ChartHandler";
import { makeItemsRepr, makeItemsOrderedRepr } from '@/logic/tooltipRepr';
import ObjectList from '@/helpers/objects/ObjectList';

import type { ObjectType } from '@/types';

import "@/styles/chart.css";

type PropsType = { 
    dataHandler: StackDataHandler
    chartType: string | undefined
    chartTexts: ObjectType
}

const ChartContent = ( { dataHandler, chartType, chartTexts }: PropsType ) => {
    
    const chartHandler = new ChartHandler( dataHandler.data );
    const items = new ObjectList( dataHandler.items ).sortBy( 'start', 'asc' );
    // sortBy start: chart lines will be displayed from bottom to top (most recent reservoir on top)

    const colorArray: string[] = [ 
        chartHandler.color[ 600 ], 
        chartHandler.color[ 500 ], 
        chartHandler.color[ 400 ], 
        chartHandler.color[ 300 ] ]
    ;

    console.log( "rendering: ChartContent..." ) 

    return (
        <div className="ChartContent">

            { chartType === 'bar'
            ?
            <BarChartComposition
                chartHandler={ chartHandler }
                labels={ chartTexts }
                colorArray={ colorArray }
                items={ items }
                texts={ chartTexts }
            />

            :
            chartType === 'area'
            ?
            <AreaChartComposition
                chartHandler={ chartHandler }
                labels={ chartTexts }
                colorArray={ colorArray }
                items={ items }
                texts={ chartTexts }
            />

            :
            <LineChartComposition
                chartHandler={ chartHandler }
                labels={ chartTexts }
                colorArray={ colorArray }
                items={ items }
                texts={ chartTexts }
            />
            }
                
        </div>
    );
}

type ChartCompositionPropsType = { 
    chartHandler: ChartHandler
    labels: ObjectType
    colorArray: string[]
    items: ObjectType[]
    texts: ObjectType
}

const LineChartComposition = ( { chartHandler, labels, colorArray, items, texts }: ChartCompositionPropsType ) => {

    const lineDashes: string[] = [ "1 1", "2 2", "4 4", "8 8" ];

    console.log( 'Rerender LineChart...' );

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
                    content={ 
                        <StackTooltip 
                            items={ items } 
                            makeItemsRepr={ makeItemsOrderedRepr }
                            texts={ texts }
                        /> 
                    } 
                />

                { items.map( ( r, i ) =>
                    <Line 
                        key={ i }
                        id={ `${i+1}`} 
                        type={ chartHandler.lineType } 
                        dataKey={ `values.${r.id}.value` }
                        stroke={ colorArray[ 0 ] } 
                        strokeWidth={ 2 } 
                        strokeDasharray={ lineDashes[ i ] }
                        dot={ false }
                        legendType="plainline"
                    />
                ) }

                <Line 
                    id="0" 
                    type={ chartHandler.lineType } 
                    dataKey="total"
                    stroke={ colorArray[ 0 ] } 
                    strokeWidth={ 2 }
                    dot={ false }
                    legendType="plainline"
                />

                <Legend 
                    align="right" 
                    verticalAlign='top'
                    height={ 24 }
                    content={ <LineLegend 
                        items={ items }
                        colorsArray={ colorArray }
                        strokeDasharray={ lineDashes }
                    /> }
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

const AreaChartComposition = ( { chartHandler, labels, colorArray, items, texts }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={ chartHandler.data }
                // stackOffset="expand"
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
                    content={ 
                        <StackTooltip 
                            items={ items } 
                            makeItemsRepr={ makeItemsRepr }
                            texts={ texts }
                        /> 
                    } 
                />

                { items.map( ( r, i ) =>
                    <Area 
                        key={ i } 
                        type={ chartHandler.lineType } 
                        dataKey={ `values.${r.id}.value` }
                        stackId="a"
                        stroke={ colorArray[ i ] } 
                        fill={ colorArray[ i ] } 
                        fillOpacity={ .65 } 
                    />
                ) }

                <Legend 
                    align="right" 
                    verticalAlign='top' 
                    height={ 24 }
                    content={ <ColorLegend 
                        items={ items }
                        colorsArray={ colorArray }
                    /> }
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

const BarChartComposition = ( { chartHandler, labels, colorArray, items, texts }: ChartCompositionPropsType ) => {

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
                    content={ 
                        <StackTooltip 
                            items={ items } 
                            makeItemsRepr={ makeItemsRepr }
                            texts={ texts }
                        /> 
                    } 
                />

                { items.map( ( r, i ) =>
                    <Bar 
                        key={ i } 
                        type={ chartHandler.lineType } 
                        dataKey={ `values.${r.id}.value` }
                        stackId="a"
                        fill={ colorArray[ i ] } 
                        fillOpacity={ 1 }
                    />
                ) }

                <Legend 
                    align="right" 
                    verticalAlign='top' 
                    height={ 24 }
                    content={ <ColorLegend 
                        items={ items }
                        colorsArray={ colorArray }
                    /> }
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default ChartContent;