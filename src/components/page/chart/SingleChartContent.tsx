"use client"

import { LineChart, Line } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { XAxis, YAxis, CartesianGrid, Tooltip, Customized  } from 'recharts';
import { ResponsiveContainer } from 'recharts';

import { TopTitle, XAxisLabel, YAxisLabel } from '@/components/page/chart/labels';
import { XAxisTick, XAxisSpatialTick, YAxisTick } from '@/components/page/chart/ticks';
import { SingleTooltip, SpatialInterruptionsTooltip } from '@/components/page/chart/tooltips';

import { SingleDataHandler } from '@/logic/DataHandler/SingleDataHandler';
import { ChartHandler, ChartHandlerFactory } from '@/logic/ChartHandler';
import { SingleChartLayoutHandler } from '@/logic/LayoutHandler/chart';

import "@/styles/chart.css";

type PropsType = { 
    dataHandler: SingleDataHandler
    chartType: string | undefined
    layoutHandler: SingleChartLayoutHandler
}

const ChartContent = ( { dataHandler, chartType, layoutHandler }: PropsType ) => {

    console.log( "rendering: ChartContent...", dataHandler.type )

    const chartHandler: ChartHandler = new ChartHandlerFactory( {
        type: 'single', 
        data : dataHandler.data, 
        legend: dataHandler.legend || {}, 
        specifierCollection: dataHandler.specifierCollection
    } ).chartHandler;

    return (
        <div className="ChartContent">

            { dataHandler.type === 'single,spatial'
            ?
            <BarChartComposition 
                chartHandler={ chartHandler }
                layoutHandler={ layoutHandler }
                CustomXAxisTick={ XAxisSpatialTick }
                CustomTooltip={ SpatialInterruptionsTooltip }
            />

            :            
            chartType === 'bar'
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
    layoutHandler: SingleChartLayoutHandler
    CustomXAxisTick?: any
    CustomTooltip?: any
}

const LineChartComposition = ( { 
    chartHandler, 
    layoutHandler, 
    CustomXAxisTick=XAxisTick,
    CustomTooltip=SingleTooltip
}: ChartCompositionPropsType ) => {

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
                    dataKey={ chartHandler.xValueKey }
                    ticks={ chartHandler.xTicks } 
                    interval={ 0 } 
                    tick={ <CustomXAxisTick data={ chartHandler.data } /> }
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
                    content={ <CustomTooltip 
                        layoutHandler={ layoutHandler }
                    /> } 
                />

                <Line
                    dataKey={ chartHandler.yValueKey }
                    type={ chartHandler.lineType } 
                    stroke={ layoutHandler.yValueHandlers[ 0 ].color[ 500 ] } 
                    strokeWidth={ 2 } 
                    dot={ false }
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

const AreaChartComposition = ( {     
    chartHandler, 
    layoutHandler, 
    CustomXAxisTick=XAxisTick,
    CustomTooltip=SingleTooltip
}: ChartCompositionPropsType ) => {

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
                    dataKey={ chartHandler.xValueKey }
                    ticks={ chartHandler.xTicks }
                    interval={ 0 } 
                    tick={ <CustomXAxisTick data={ chartHandler.data } /> }
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
                    content={ <CustomTooltip 
                        layoutHandler={ layoutHandler }
                    /> } 
                />

                <Area 
                    dataKey={ chartHandler.yValueKey }
                    type={ chartHandler.lineType } 
                    stroke={ layoutHandler.yValueHandlers[ 0 ].color[ 400 ] } 
                    fill={ layoutHandler.yValueHandlers[ 0 ].color[ 300 ] } 
                    fillOpacity={ .65 } 
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

const BarChartComposition = ( {     
    chartHandler, 
    layoutHandler, 
    CustomXAxisTick=XAxisTick,
    CustomTooltip=SingleTooltip
}: ChartCompositionPropsType ) => {

    console.log( 'CustomXAxisTick', CustomXAxisTick )
    console.log( 'CustomTooltip', CustomTooltip )
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
                    dataKey={ chartHandler.xValueKey }
                    ticks={ chartHandler.xTicks }
                    interval={ 0 } 
                    tick={ <CustomXAxisTick data={ chartHandler.data } /> }
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
                    content={ <CustomTooltip 
                        layoutHandler={ layoutHandler }
                    /> } 
                />

                <Bar 
                    dataKey={ chartHandler.yValueKey }
                    stroke={ layoutHandler.yValueHandlers[ 0 ].color[ 400 ] } 
                    fill={ layoutHandler.yValueHandlers[ 0 ].color[ 300 ] } 
                    fillOpacity={ .65 } 
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default ChartContent;
export { LineChartComposition, AreaChartComposition, BarChartComposition };