"use client"

import { LineChart, Line, Legend } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Customized } from 'recharts';

import { TopTitle, XAxisLabel, YAxisLabel } from '@/components/Page/Chart/labels';
import { XAxisTick, YAxisTick } from '@/components/Page/Chart/ticks';
import { ComplexTooltip } from '@/components/Page/Chart/tooltips';
import { LineLegend, ColorLegend } from "@/components/Page/Chart/legends";

import { SavingsReservoirDataParser } from '@/logic/_common/DataParser';
import { ChartHandler } from "@/logic/_common/ChartHandler";
import { makeReservoirsRepr, makeReservoirsOrderedRepr } from '@/logic/savings/chart';

import ObjectList from '@/helpers/objects/ObjectList';

import type { ObjectType } from '@/types';
import type { RequestResultType } from "@/types/requestResult";

import "@/styles/chart.css";

type PropsType = { 
    result: RequestResultType | null
    chartType: string | undefined
    chartLabels: ObjectType
}

const ChartContent = ( { result, chartType, chartLabels }: PropsType ) => {
    
    const dataParser = new SavingsReservoirDataParser( result );
    const data = dataParser.data;
    const reservoirs = new ObjectList( dataParser.reservoirs ).sortBy( 'start', 'asc' );
    // sortBy start: chart lines will be displayed from bottom to top (most recent reservoir on top)
    const chartHandler = new ChartHandler( data );

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
                labels={ chartLabels }
                colorArray={ colorArray }
                reservoirs={ reservoirs }
            />

            :
            chartType === 'area'
            ?
            <AreaChartComposition
                chartHandler={ chartHandler }
                labels={ chartLabels }
                colorArray={ colorArray }
                reservoirs={ reservoirs }
            />

            :
            <LineChartComposition
                chartHandler={ chartHandler }
                labels={ chartLabels }
                colorArray={ colorArray }
                reservoirs={ reservoirs }
            />
            }
                
        </div>
    );
}

type ChartCompositionPropsType = { 
    chartHandler: ChartHandler
    labels: ObjectType
    colorArray: string[]
    reservoirs: ObjectType[]
}

const LineChartComposition = ( { chartHandler, labels, colorArray, reservoirs }: ChartCompositionPropsType ) => {

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
                        <ComplexTooltip 
                            reservoirs={ reservoirs } 
                            makeReservoirsRepr={ makeReservoirsOrderedRepr }
                        /> 
                    } 
                />

                { reservoirs.map( ( r, i ) =>
                    <Line 
                        key={ i }
                        id={ `${i+1}`} 
                        type={ chartHandler.lineType } 
                        dataKey={ `quantities.${r.id}.quantity` }
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
                        reservoirs={ reservoirs }
                        colorsArray={ colorArray }
                        strokeDasharray={ lineDashes }
                    /> }
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

const AreaChartComposition = ( { chartHandler, labels, colorArray, reservoirs }: ChartCompositionPropsType ) => {

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
                        <ComplexTooltip 
                            reservoirs={ reservoirs } 
                            makeReservoirsRepr={ makeReservoirsRepr }
                        /> 
                    } 
                />

                { reservoirs.map( ( r, i ) =>
                    <Area 
                        key={ i } 
                        type={ chartHandler.lineType } 
                        dataKey={ `quantities.${r.id}.quantity` }
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
                        reservoirs={ reservoirs }
                        colorsArray={ colorArray }
                    /> }
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

const BarChartComposition = ( { chartHandler, labels, colorArray, reservoirs }: ChartCompositionPropsType ) => {

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
                        <ComplexTooltip 
                            reservoirs={ reservoirs } 
                            makeReservoirsRepr={ makeReservoirsRepr }
                        /> 
                    } 
                />

                { reservoirs.map( ( r, i ) =>
                    <Bar 
                        key={ i } 
                        type={ chartHandler.lineType } 
                        dataKey={ `quantities.${r.id}.quantity` }
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
                        reservoirs={ reservoirs }
                        colorsArray={ colorArray }
                    /> }
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default ChartContent;