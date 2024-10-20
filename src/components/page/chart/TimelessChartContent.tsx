"use client"

import { BarChart, Bar } from 'recharts';
import { XAxis, YAxis, CartesianGrid, Tooltip, Customized  } from 'recharts';
import { ResponsiveContainer } from 'recharts';

import { TopTitle, XAxisLabel, YAxisLabel } from '@/components/page/chart/labels';
import { XAxisTimelessTick, YAxisTick } from '@/components/page/chart/ticks';
import { TimelessTooltip } from '@/components/page/chart/tooltips';

import { SingleTimelessDataHandler } from '@/logic/DataHandler/SingleDataHandler';
import { ChartHandler, ChartHandlerFactory } from '@/logic/ChartHandler';

import type { ObjectType } from '@/types';

import "@/styles/chart.css";

type PropsType = { 
    chartType: string | undefined
    dataHandler: SingleTimelessDataHandler
    layoutSpecifier: ObjectType
}

const ChartContent = ( { chartType, dataHandler, layoutSpecifier }: PropsType ) => {

    console.log( "rendering: TimelessChartContent..." )//, dataHandler )

    const chartHandler: ChartHandler = new ChartHandlerFactory( {
        type: 'single', 
        data : dataHandler.data, 
        legend: dataHandler.legend || {}, 
        specifierCollection: dataHandler.specifierCollection
    } ).chartHandler;

    chartHandler.data.sort( ( a, b ) => ( a[ chartHandler.yValueKey ] < b[ chartHandler.yValueKey ] ? 1 : -1 ) )

    // prepare items as object, with ids as keys

    const itemsKey = Object.keys( chartHandler.legend )[ 0 ];
    const legendItems = chartHandler.legend[ itemsKey ] || [];

    let items: ObjectType = {}
    for ( const item of legendItems ) {
        items[ item.id ] = item.name_el;
    }

    return (
        <div className="ChartContent">
            <BarChartComposition
                chartHandler={ chartHandler }
                layoutSpecifier={ layoutSpecifier }
                items={ items }
            />
        </div>
    );
}

type ChartCompositionPropsType = { 
    chartHandler: ChartHandler
    layoutSpecifier: ObjectType
    items: ObjectType
}

const BarChartComposition = ( { chartHandler, layoutSpecifier, items }: ChartCompositionPropsType ) => {

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
                    tick={ <XAxisTimelessTick 
                        data={ chartHandler.data }
                        items={ items } />
                     }
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
                    content={ <TimelessTooltip 
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