"use client"

import { LineChart, Line, Legend } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { XAxis, YAxis, CartesianGrid, Tooltip, Customized  } from 'recharts';
import { ResponsiveContainer } from 'recharts';

import { TopTitle, XAxisLabel, YAxisLabel } from '@/components/page/chart/labels';
import { XAxisTick, XAxisSpatialTick, YAxisTick } from '@/components/page/chart/ticks';
import { SingleTooltip, SpatialInterruptionsTooltip } from '@/components/page/chart/tooltips';
import { StandardLegend } from '@/components/page/chart/legends';

import { SingleDataHandler } from '@/logic/DataHandler/SingleDataHandler';
import { SingleChartLayoutHandler } from '@/logic/LayoutHandler/chart/_abstract';

import "@/styles/chart.css";

type PropsType = { 
    dataHandler: SingleDataHandler
    chartType: string | undefined
    layoutHandler: SingleChartLayoutHandler
}

const ChartContent = ( { dataHandler, chartType, layoutHandler }: PropsType ) => {

    console.log( "rendering: ChartContent...", dataHandler.type )

    return (
        <div className="ChartContent">

            { dataHandler.type === 'single,spatial'
            ?
            <BarChartComposition 
                layoutHandler={ layoutHandler }
                CustomXAxisTick={ XAxisSpatialTick }
                CustomTooltip={ SpatialInterruptionsTooltip }
            />

            :            
            chartType === 'bar'
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
    layoutHandler: SingleChartLayoutHandler
    CustomXAxisTick?: any
    CustomTooltip?: any
}

const LineChartComposition = ( { 
    layoutHandler, 
    CustomXAxisTick=XAxisTick,
    CustomTooltip=SingleTooltip
}: ChartCompositionPropsType ) => {

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
                    tick={ <CustomXAxisTick data={ layoutHandler.data } /> }
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
                    content={ <CustomTooltip 
                        layoutHandler={ layoutHandler }
                    /> } 
                />

                <Line
                    dataKey={ layoutHandler.yValueHandlers[ 0 ].key }
                    type={ layoutHandler.lineType } 
                    stroke={ layoutHandler.yValueHandlers[ 0 ].color[ 500 ] } 
                    strokeWidth={ 2 } 
                    dot={ false }
                />

                <Legend 
                    align="right" 
                    verticalAlign='top'
                    height={ 24 }
                    content={ <StandardLegend 
                        labels={ [ layoutHandler.yValueHandlers[ 0 ].label ] }
                        colors={ [ layoutHandler.yValueHandlers[ 0 ].color[ 500 ] ] }
                    /> }
                />

            </LineChart>
        </ResponsiveContainer>
    );
}

const AreaChartComposition = ( {     
    // chartHandler, 
    layoutHandler, 
    CustomXAxisTick=XAxisTick,
    CustomTooltip=SingleTooltip
}: ChartCompositionPropsType ) => {

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
                    tick={ <CustomXAxisTick data={ layoutHandler.data } /> }
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
                    content={ <CustomTooltip 
                        layoutHandler={ layoutHandler }
                    /> } 
                />

                <Area 
                    dataKey={ layoutHandler.yValueHandlers[ 0 ].key }
                    type={ layoutHandler.lineType } 
                    stroke={ layoutHandler.yValueHandlers[ 0 ].color[ 400 ] } 
                    fill={ layoutHandler.yValueHandlers[ 0 ].color[ 300 ] } 
                    fillOpacity={ .65 } 
                />

                <Legend 
                    align="right" 
                    verticalAlign='top'
                    height={ 24 }
                    content={ <StandardLegend 
                        labels={ [ layoutHandler.yValueHandlers[ 0 ].label ] }
                        colors={ [ layoutHandler.yValueHandlers[ 0 ].color[ 500 ] ] }
                    /> }
                />

            </AreaChart>
        </ResponsiveContainer>
    );
}

const BarChartComposition = ( {     
    layoutHandler, 
    CustomXAxisTick=XAxisTick,
    CustomTooltip=SingleTooltip
}: ChartCompositionPropsType ) => {

    // console.log( 'CustomXAxisTick', CustomXAxisTick )
    // console.log( 'CustomTooltip', CustomTooltip )
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
                    tick={ <CustomXAxisTick data={ layoutHandler.data } /> }
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
                    content={ <CustomTooltip 
                        layoutHandler={ layoutHandler }
                    /> } 
                />

                <Bar 
                    dataKey={ layoutHandler.yValueHandlers[ 0 ].key }
                    stroke={ layoutHandler.yValueHandlers[ 0 ].color[ 400 ] } 
                    fill={ layoutHandler.yValueHandlers[ 0 ].color[ 300 ] } 
                    fillOpacity={ .65 } 
                />

                <Legend 
                    align="right" 
                    verticalAlign='top'
                    height={ 24 }
                    content={ <StandardLegend 
                        labels={ [ layoutHandler.yValueHandlers[ 0 ].label ] }
                        colors={ [ layoutHandler.yValueHandlers[ 0 ].color[ 500 ] ] }
                    /> }
                />

            </BarChart>
        </ResponsiveContainer>
    );
}

export default ChartContent;
export { LineChartComposition, AreaChartComposition, BarChartComposition };