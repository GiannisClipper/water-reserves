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

import StackDataHandler from '@/logic/DataHandler/StackDataHandler';
import { ChartHandler, ChartHandlerFactory, StackChartHandler } from "@/logic/ChartHandler";
import ObjectList from '@/helpers/objects/ObjectList';
import { makeItemsRepr, makeItemsOrderedRepr } from '@/logic/tooltipRepr';

import type { ObjectType } from '@/types';

import "@/styles/chart.css";

type PropsType = { 
    dataHandler: StackDataHandler
    chartType: string | undefined
    layoutSpecifier: ObjectType
}

const ChartContent = ( { dataHandler, chartType, layoutSpecifier }: PropsType ) => {

    const chartHandler: ChartHandler = new ChartHandlerFactory( 
        'stack', 
        dataHandler.data, 
        dataHandler.specifierCollection 
    ).chartHandler;

    console.log( "rendering: ChartContent...", chartHandler.toJSON() )

    const items = new ObjectList( dataHandler.items ).sortBy( 'start', 'asc' );
    // sortBy start: chart lines will be displayed from bottom to top (most recent reservoir on top)

    const colorArray: string[] = [ 
        layoutSpecifier.colors[ 0 ][ 600 ], 
        layoutSpecifier.colors[ 0 ][ 500 ], 
        layoutSpecifier.colors[ 0 ][ 400 ], 
        layoutSpecifier.colors[ 0 ][ 300 ]
    ];

    console.log( "rendering: ChartContent..." ) 

    return (
        <div className="ChartContent">

            { chartType === 'bar'
            ?
            <BarChartComposition
                chartHandler={ chartHandler }
                layoutSpecifier={ layoutSpecifier }
                colorArray={ colorArray }
                items={ items }
            />

            :
            chartType === 'area'
            ?
            <AreaChartComposition
                chartHandler={ chartHandler }
                layoutSpecifier={ layoutSpecifier }
                colorArray={ colorArray }
                items={ items }
            />

            :
            <LineChartComposition
                chartHandler={ chartHandler }
                layoutSpecifier={ layoutSpecifier }
                colorArray={ colorArray }
                items={ items }
            />
            }
                
        </div>
    );
}

type ChartCompositionPropsType = { 
    chartHandler: ChartHandler
    colorArray: string[]
    items: ObjectType[]
    layoutSpecifier: ObjectType
}

const LineChartComposition = ( { chartHandler, colorArray, items, layoutSpecifier }: ChartCompositionPropsType ) => {

    const lineDashes: string[] = [ "1 1", "2 2", "4 4", "8 8" ];

    console.log( 'Rerender LineChart...' );

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
                    content={ 
                        <StackTooltip 
                            specifierCollection={ chartHandler.specifierCollection }
                            items={ items } 
                            makeItemsRepr={ makeItemsOrderedRepr }
                        /> 
                    } 
                />

                { items.map( ( r, i ) =>
                    <Line 
                        key={ i }
                        id={ `${i+1}`}
                        type={ chartHandler.lineType } 
                        dataKey={ ( chartHandler as StackChartHandler ).composeNestedValueKey( r.id ) }
                        stroke={ colorArray[ i ] } 
                        strokeWidth={ 2 } 
                        strokeDasharray={ lineDashes[ i ] }
                        dot={ false }
                        legendType="plainline"
                    />
                ) }

                <Line 
                    id="0" 
                    type={ chartHandler.lineType } 
                    dataKey={ chartHandler.specifierCollection.getNotNestedByAxeY()[ 0 ].key }
                    stroke={ colorArray[ colorArray.length - 1 ] } 
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

const AreaChartComposition = ( { chartHandler, colorArray, items, layoutSpecifier }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={ chartHandler.data }
                // stackOffset="expand"
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
                    content={ 
                        <StackTooltip 
                            specifierCollection={ chartHandler.specifierCollection }
                            items={ items } 
                            makeItemsRepr={ makeItemsRepr }
                        /> 
                    } 
                />

                { items.map( ( r, i ) =>
                    <Area 
                        key={ i } 
                        type={ chartHandler.lineType } 
                        dataKey={ ( chartHandler as StackChartHandler ).composeNestedValueKey( r.id ) }
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

const BarChartComposition = ( { chartHandler, colorArray, items, layoutSpecifier }: ChartCompositionPropsType ) => {

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
                    content={ 
                        <StackTooltip 
                            specifierCollection={ chartHandler.specifierCollection }
                            items={ items } 
                            makeItemsRepr={ makeItemsRepr }
                        /> 
                    } 
                />

                { items.map( ( r, i ) =>
                    <Bar 
                        key={ i } 
                        type={ chartHandler.lineType } 
                        dataKey={ ( chartHandler as StackChartHandler ).composeNestedValueKey( r.id ) }
                        stackId="a"
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
            </BarChart>
        </ResponsiveContainer>
    );
}

export default ChartContent;