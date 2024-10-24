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

import { StackDataHandler } from '@/logic/DataHandler/StackDataHandler';
import { ChartHandler, ChartHandlerFactory } from "@/logic/ChartHandler";

import { ChartLayoutHandler } from '@/logic/LayoutHandler/chart';
import { ValueHandler } from '@/logic/ValueHandler';

import "@/styles/chart.css";
import { ObjectType } from '@/types';

type PropsType = { 
    dataHandler: StackDataHandler
    chartType: string | undefined
    layoutHandler: ChartLayoutHandler
}

const ChartContent = ( { dataHandler, chartType, layoutHandler }: PropsType ) => {

    const chartHandler: ChartHandler = new ChartHandlerFactory( {
        type: 'stack', 
        data : dataHandler.data, 
        legend: dataHandler.legend || {}, 
        specifierCollection: dataHandler.specifierCollection
    } ).chartHandler;

    const colorArray: string[] = [ 
        layoutHandler.yValueHandlers[ 0 ].color[ 600 ], 
        layoutHandler.yValueHandlers[ 0 ].color[ 500 ], 
        layoutHandler.yValueHandlers[ 0 ].color[ 400 ], 
        layoutHandler.yValueHandlers[ 0 ].color[ 300 ], 
    ];

    console.log( "rendering: ChartContent..." ) 

    return (
        <div className="ChartContent">

            { chartType === 'bar'
            ?
            <BarChartComposition
                chartHandler={ chartHandler }
                layoutHandler={ layoutHandler }
                colorArray={ colorArray }
            />

            :
            chartType === 'area'
            ?
            <AreaChartComposition
                chartHandler={ chartHandler }
                layoutHandler={ layoutHandler }
                colorArray={ colorArray }
            />

            :
            <LineChartComposition
                chartHandler={ chartHandler }
                layoutHandler={ layoutHandler }
                colorArray={ colorArray }
            />
            }
                
        </div>
    );
}

type ChartCompositionPropsType = { 
    chartHandler: ChartHandler
    colorArray: string[]
    layoutHandler: ChartLayoutHandler
}

const LineChartComposition = ( { chartHandler, colorArray, layoutHandler }: ChartCompositionPropsType ) => {

    const lineDashes: string[] = [ "1 1", "2 2", "4 4", "8 8" ];

    const key = Object.keys( chartHandler.legend )[ 0 ];
    const legendItems: [] = chartHandler.legend[ key ];

    console.log( 'Rerender LineChart...', layoutHandler.yValueHandlers, chartHandler.data );

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
                    content={ 
                        <StackTooltip 
                            layoutHandler={ layoutHandler }
                            sortFunc={ ( result: ObjectType[] ) => result.sort( ( a, b ) => b.value - a.value ) }
                        /> 
                    } 
                />

                { layoutHandler.yValueHandlers.slice( 0, -1 ).map( ( handler: ValueHandler, i: number ) =>
                    <Line 
                        key={ i }
                        id={ `${i+1}`}
                        type={ chartHandler.lineType } 
                        dataKey={ handler.key }
                        stroke={ handler.color[ 600 ] } 
                        strokeWidth={ 2 } 
                        strokeDasharray={ lineDashes[ i ] }
                        dot={ false }
                        legendType="plainline"
                    />
                ) }

                <Line 
                    id="0" 
                    type={ chartHandler.lineType } 
                    dataKey={ layoutHandler.yValueHandlers[ layoutHandler.yValueHandlers.length - 1 ].key }
                    stroke={ layoutHandler.yValueHandlers[ layoutHandler.yValueHandlers.length - 1 ].color[ 600 ] } 
                    strokeWidth={ 2 }
                    dot={ false }
                    legendType="plainline"
                />

                <Legend 
                    align="right" 
                    verticalAlign='top'
                    height={ 24 }
                    content={ <LineLegend 
                        items={ legendItems }
                        colorsArray={ colorArray }
                        strokeDasharray={ lineDashes }
                    /> }
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

const AreaChartComposition = ( { chartHandler, colorArray, layoutHandler }: ChartCompositionPropsType ) => {

    const key = Object.keys( chartHandler.legend )[ 0 ];
    const legendItems: [] = chartHandler.legend[ key ];

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={ chartHandler.data }
                // stackOffset="expand"
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
                    content={ 
                        <StackTooltip 
                            layoutHandler={ layoutHandler }
                            sortFunc={ ( result: ObjectType[] ) => result.reverse() }
                        /> 
                    } 
                />

                { layoutHandler.yValueHandlers.slice( 0, -1 ).map( ( handler: ValueHandler, i: number ) =>
                    <Area 
                        key={ i } 
                        type={ chartHandler.lineType } 
                        stackId="a"
                        dataKey={ handler.key }
                        stroke={ handler.color[ 600 - 100 * i ] } 
                        fill={ handler.color[ 600 - 100 * i ] } 
                        fillOpacity={ .65 } 
                    />
                ) }

                <Legend 
                    align="right" 
                    verticalAlign='top' 
                    height={ 24 }
                    content={ <ColorLegend 
                        items={ legendItems }
                        colorsArray={ colorArray }
                    /> }
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

const BarChartComposition = ( { chartHandler, colorArray, layoutHandler }: ChartCompositionPropsType ) => {

    const key = Object.keys( chartHandler.legend )[ 0 ];
    const legendItems: [] = chartHandler.legend[ key ];

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
                    content={ 
                        <StackTooltip 
                            layoutHandler={ layoutHandler }
                            sortFunc={ ( result: ObjectType[] ) => result.reverse() }
                        /> 
                    } 
                />

                { layoutHandler.yValueHandlers.slice( 0, -1 ).map( ( handler: ValueHandler, i: number ) =>
                    <Bar 
                        key={ i } 
                        type={ chartHandler.lineType } 
                        stackId="a"
                        dataKey={ handler.key }
                        fill={ handler.color[ 600 - 100 * i ] } 
                        fillOpacity={ .65 }
                    />
                ) }

                <Legend 
                    align="right" 
                    verticalAlign='top' 
                    height={ 24 }
                    content={ <ColorLegend 
                        items={ legendItems }
                        colorsArray={ colorArray }
                    /> }
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default ChartContent;