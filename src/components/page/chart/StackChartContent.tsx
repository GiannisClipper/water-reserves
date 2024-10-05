"use client"

import {
    ROSE, PINK, FUCHSIA, PURPLE, VIOLET,
    INDIGO, BLUE, SKY, CYAN, TEAL, EMERALD, 
    GREEN, LIME, YELLOW, AMBER, ORANGE, RED, 
    STONE, NEUTRAL, ZINC, GRAY, SLATE
} from '@/helpers/colors';

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
import { ChartHandler, ChartHandlerFactory } from "@/logic/ChartHandler";
import { makeItemsRepr, makeItemsOrderedRepr } from '@/logic/tooltipRepr';
import ObjectList from '@/helpers/objects/ObjectList';

import type { ObjectType } from '@/types';

import "@/styles/chart.css";

type PropsType = { 
    dataHandler: StackDataHandler
    chartType: string | undefined
    metadataHandler: ObjectType
}

const ChartContent = ( { dataHandler, chartType, metadataHandler }: PropsType ) => {
    
    const chartHandler: ChartHandler = new ChartHandlerFactory( 'stack', dataHandler.data ).chartHandler;
    console.log( "rendering: ChartContent...", chartHandler.toJSON() )

    const items = new ObjectList( dataHandler.items ).sortBy( 'start', 'asc' );
    // sortBy start: chart lines will be displayed from bottom to top (most recent reservoir on top)

    const colorArray: string[] = [ 
        metadataHandler.colors[ 0 ][ 600 ], 
        metadataHandler.colors[ 0 ][ 500 ], 
        metadataHandler.colors[ 0 ][ 400 ], 
        metadataHandler.colors[ 0 ][ 300 ]
    ];

    console.log( "rendering: ChartContent..." ) 

    return (
        <div className="ChartContent">

            { chartType === 'bar'
            ?
            <BarChartComposition
                chartHandler={ chartHandler }
                metadataHandler={ metadataHandler }
                colorArray={ colorArray }
                items={ items }
            />

            :
            chartType === 'area'
            ?
            <AreaChartComposition
                chartHandler={ chartHandler }
                metadataHandler={ metadataHandler }
                colorArray={ colorArray }
                items={ items }
            />

            :
            <LineChartComposition
                chartHandler={ chartHandler }
                metadataHandler={ metadataHandler }
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
    metadataHandler: ObjectType
}

const LineChartComposition = ( { chartHandler, colorArray, items, metadataHandler }: ChartCompositionPropsType ) => {

    const lineDashes: string[] = [ "1 1", "2 2", "4 4", "8 8" ];
    // const lineDashes: string[] = [ "1 0", "1 0", "1 0", "1 0", "1 0", "1 0", "1 0", "1 0", "1 0" ];
    // colorArray = [ SKY[ 500 ], ROSE[ 500 ], CYAN[ 500 ], AMBER[ 500 ], BLUE[ 500 ], FUCHSIA[ 500 ], TEAL[ 500 ], ORANGE[ 500 ], NEUTRAL[ 900 ] ];

    console.log( 'Rerender LineChart...' );

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
                    content={ 
                        <StackTooltip 
                            items={ items } 
                            makeItemsRepr={ makeItemsOrderedRepr }
                            metadataHandler={ metadataHandler }
                        /> 
                    } 
                />

                { items.map( ( r, i ) =>
                    <Line 
                        key={ i }
                        id={ `${i+1}`}
                        type={ chartHandler.lineType } 
                        dataKey={ `values.${r.id}.value` }
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
                    dataKey="total"
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

const AreaChartComposition = ( { chartHandler, colorArray, items, metadataHandler }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={ chartHandler.data }
                // stackOffset="expand"
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
                    content={ 
                        <StackTooltip 
                            items={ items } 
                            makeItemsRepr={ makeItemsRepr }
                            metadataHandler={ metadataHandler }
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

const BarChartComposition = ( { chartHandler, colorArray, items, metadataHandler }: ChartCompositionPropsType ) => {

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
                    content={ 
                        <StackTooltip 
                            items={ items } 
                            makeItemsRepr={ makeItemsRepr }
                            metadataHandler={ metadataHandler }
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