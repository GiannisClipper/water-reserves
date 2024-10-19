"use client"

import { BarChart, Bar } from 'recharts';
import { XAxis, YAxis, CartesianGrid, Tooltip, Customized  } from 'recharts';
import { ResponsiveContainer } from 'recharts';

import { TopTitle, XAxisLabel, YAxisLabel } from '@/components/page/chart/labels';
import { XAxisTimelessTick, YAxisTick } from '@/components/page/chart/ticks';
import { TimelessTooltip } from '@/components/page/chart/tooltips';

import TimelessDataHandler from '@/logic/DataHandler/TimelessDataHandler';
import { ChartHandler, ChartHandlerFactory } from '@/logic/ChartHandler';

import type { ObjectType } from '@/types';

import "@/styles/chart.css";

type PropsType = { 
    chartType: string | undefined
    dataHandler: TimelessDataHandler
    metadataHandler: ObjectType
}

const ChartContent = ( { chartType, dataHandler, metadataHandler }: PropsType ) => {

    console.log( "rendering: ChartContent..." )//, dataHandler.data )

    if ( chartType === 'line2' ) {
        dataHandler.specifierCollection._specifiers[1].axeXY=''
        dataHandler.specifierCollection._specifiers[2].axeXY='Y'
    } else {
        dataHandler.specifierCollection._specifiers[1].axeXY='Y'
        dataHandler.specifierCollection._specifiers[2].axeXY=''
    }

    const chartHandler: ChartHandler = new ChartHandlerFactory( 
        'single', 
        dataHandler.data, 
        dataHandler.specifierCollection 
    ).chartHandler;

    chartHandler.data.sort( ( a, b ) => ( a[ chartHandler.yValueKey ] < b[ chartHandler.yValueKey ] ? 1 : -1 ) )

    // prepare items as object, with ids as keys

    let items: ObjectType = {}
    if ( dataHandler._items ) {
        for ( const item of dataHandler._items ) {
            items[ item.id ] = item.name_el;
        }
    }
    // console.log( 'items', items)

    // for ( const row of dataHandler.data ) {
    //     row.points = items[ row.municipality_id ].population / row.points; 
    //     console.log( 'row.municipality_id', row.municipality_id, items[ row.municipality_id ].population, row.points )
    // }

    console.log( "rendering: ChartContent...", chartHandler._specifierCollection )//, dataHandler.data, dataHandler.legend );

    return (
        <div className="ChartContent">
            <BarChartComposition
                chartHandler={ chartHandler }
                metadataHandler={ metadataHandler }
                items={ items }
            />
        </div>
    );
}

type ChartCompositionPropsType = { 
    chartHandler: ChartHandler
    metadataHandler: ObjectType
    items: ObjectType
}

const BarChartComposition = ( { chartHandler, metadataHandler, items }: ChartCompositionPropsType ) => {

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
                    dataKey={ chartHandler.xValueKey }
                    ticks={ chartHandler.xTicks }
                    interval={ 0 } 
                    tick={ <XAxisTimelessTick 
                        data={ chartHandler.data }
                        items={ items } />
                     }
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
                    content={ <TimelessTooltip 
                        specifierCollection={ chartHandler.specifierCollection }
                        items={ items }
                    /> } 
                />

                <Bar 
                    dataKey={ chartHandler.yValueKey }
                    stroke={ metadataHandler.colors[ 0 ][ 400 ] } 
                    fill={ metadataHandler.colors[ 0 ][ 300 ] } 
                    fillOpacity={ .65 } 
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default ChartContent;