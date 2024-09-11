"use client"

import { LineChart, Line, Legend } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { BarChart, Bar, Rectangle } from 'recharts';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

import { CustomizedXAxisTick } from '@/components/Page/Chart';

import { getXTicks, getYTicks } from '@/logic/savings/chart';
import { getLineType } from '@/logic/savings/_common';
import { getReservoirs, getNonAggregatedData } from '@/logic/savings-reservoir/_common';
import { makeReservoirsRepr, makeReservoirsOrderedRepr } from '@/logic/savings-reservoir/chart';

import { withCommas } from '@/helpers/numbers';
import { timeLabel } from '@/helpers/time';
import { SKY } from '@/helpers/colors';

import type { ObjectType } from '@/types';
import type { LineType } from '@/logic/savings/_common';
import type { RequestResultType } from "@/types/requestResult";

import "@/styles/chart.css";

type PropsType = { 
    result: RequestResultType | null
    chartType: string | undefined
}


const ChartContent = ( { result, chartType }: PropsType ) => {

    const reservoirs: ObjectType[] = getReservoirs( result );
    const data = getNonAggregatedData( result, reservoirs );
    const xTicks: string[] = getXTicks( data );
    const yTicks: number[] = getYTicks( data );
    const lineType: LineType = getLineType( xTicks );

    const STROKES: string[] = [ "1 1", "2 2", "4 4", "8 8" ];

    console.log( "rendering: ChartContent...", data, xTicks, yTicks )

    return (
        <div className="ChartContent">

            { chartType === 'bar'
            ?
            <BarChartComposition
                data={ data }
                xTicks={ xTicks }
                yTicks={ yTicks }
                lineType={ lineType }
                color={ SKY }
                reservoirs={ reservoirs }
            />

            :
            chartType === 'area'
            ?
            <AreaChartComposition
                data={ data }
                xTicks={ xTicks }
                yTicks={ yTicks }
                lineType={ lineType }
                color={ SKY }
                reservoirs={ reservoirs }
            />

            :
            <LineChartComposition
                data={ data }
                xTicks={ xTicks }
                yTicks={ yTicks }
                lineType={ lineType }
                color={ SKY }
                reservoirs={ reservoirs }
            />
            }
                
        </div>
    );
}

type ChartCompositionPropsType = { 
    data: ObjectType[]
    xTicks: string[]
    yTicks: number[]
    lineType: LineType
    color: ObjectType
    reservoirs: ObjectType[]
}

const LineChartComposition = ( { data, xTicks, yTicks, lineType, color, reservoirs }: ChartCompositionPropsType ) => {

    const strokeDasharray: string[] = [ "1 1", "2 2", "4 4", "8 8" ];

    return (
        <ResponsiveContainer height="100%" width="100%">
            <LineChart
                data={ data }
                margin={{ top: 20, right: 20, bottom: 60, left: 40 }}
            >
                <CartesianGrid 
                    strokeDasharray="3 3" 
                />

                <XAxis 
                    dataKey="time" 
                    ticks={ xTicks } 
                    interval={ 0 } 
                    tick={ <CustomizedXAxisTick data={ data } /> } 
                />

                <YAxis 
                    domain={ [ yTicks[ 0 ], yTicks[ yTicks.length - 1 ] ] } 
                    ticks={ yTicks } 
                    interval={ 0 } 
                    tickFormatter={ x => withCommas( x ) } 
                />

                <Tooltip 
                    content={ 
                        <CustomTooltip 
                            reservoirs={ reservoirs } 
                            makeReservoirsRepr={ makeReservoirsOrderedRepr }
                        /> 
                    } 
                />

                { reservoirs.map( ( r, i ) =>
                    <Line 
                        key={ i } 
                        type={ lineType } 
                        dataKey={ `quantities.${r.id}` }
                        stroke={ color[ 600 ] } 
                        strokeWidth={ 2 } 
                        strokeDasharray={ strokeDasharray[ i ] }
                        dot={ false }
                        legendType="plainline"
                    />
                ) }

                <Line 
                    type={ lineType } 
                    dataKey="total"
                    stroke={ color[ 600 ] } 
                    strokeWidth={ 2 } 
                    dot={ false }
                    legendType="plainline"
                />

                <Legend 
                    align="right" 
                    verticalAlign='top' 
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

const AreaChartComposition = ( { data, xTicks, yTicks, lineType, color, reservoirs }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer height="100%" width="100%">
            <AreaChart
                data={ data }
                margin={{ top: 20, right: 20, bottom: 60, left: 40 }}
                // stackOffset="expand"
            >
                <CartesianGrid 
                    strokeDasharray="3 3" 
                />

                <XAxis 
                    dataKey="time" 
                    ticks={ xTicks } 
                    interval={ 0 } 
                    tick={ <CustomizedXAxisTick data={ data } /> } 
                />

                <YAxis 
                    domain={ [ yTicks[ 0 ], yTicks[ yTicks.length -1 ] ] } 
                    ticks={ yTicks } 
                    interval={ 0 } 
                    tickFormatter={ x => withCommas( x ) } 
                />

                {/* <YAxis tickFormatter={ decimal => `${(decimal * 100).toFixed( 0 )}%` } /> */}

                <Tooltip 
                    content={ 
                        <CustomTooltip 
                            reservoirs={ reservoirs } 
                            makeReservoirsRepr={ makeReservoirsRepr }
                        /> 
                    } 
                />

                { reservoirs.map( ( r, i ) =>
                    <Area 
                        key={ i } 
                        type={ lineType } 
                        dataKey={ `quantities.${r.id}` }
                        stackId="a"
                        stroke={ color[ 600 - i * 100 ] } 
                        fill={ color[ 600 - i * 100 ] } 
                        fillOpacity={ .65 } 
                    />
                ) }

                <Legend 
                    align="right" 
                    verticalAlign='top' 
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

const BarChartComposition = ( { data, xTicks, yTicks, lineType, color, reservoirs }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer height="100%" width="100%">
            <BarChart
                data={ data }
                margin={{ top: 20, right: 20, bottom: 60, left: 40 }}
            >
                <CartesianGrid 
                    strokeDasharray="3 3" 
                />

                <XAxis 
                    dataKey="time" 
                    ticks={ xTicks } 
                    interval={ 0 } 
                    tick={ <CustomizedXAxisTick data={ data } /> } 
                />

                <YAxis 
                    domain={ [ yTicks[ 0 ], yTicks[ yTicks.length -1 ] ] } 
                    ticks={ yTicks } 
                    interval={ 0 } 
                    tickFormatter={ x => withCommas( x ) } 
                />

                <Tooltip 
                    cursor={{ fill: '#0369a1' }}
                    content={ 
                        <CustomTooltip 
                            reservoirs={ reservoirs } 
                            makeReservoirsRepr={ makeReservoirsRepr }
                        /> 
                    } 
                />

                { reservoirs.map( ( r, i ) =>
                    <Bar 
                        key={ i } 
                        type={ lineType } 
                        dataKey={ `quantities.${r.id}` }
                        stackId="a"
                        fill={ color[ 600 - i * 100 ] } 
                        fillOpacity={ 1 }
                    />
                ) }

                <Legend 
                    align="right" 
                    verticalAlign='top' 
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

type TooltipPropsType = {
    active?: boolean
    payload?: any
    label?: string
    reservoirs: ObjectType[]
    makeReservoirsRepr: CallableFunction
} 

const CustomTooltip = ( { active, payload, label, reservoirs, makeReservoirsRepr }: TooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        const { time, total, quantities } = payload[ 0 ].payload;

        const reservoirsRepr: ObjectType[] = makeReservoirsRepr( reservoirs, quantities );

        return (
            <div className="Tooltip">
                <p>{ `${timeLabel( time )}: ${time}` }</p>

                <table>
                    <tbody>
                        <tr className='total'>
                            <td>Σύνολο</td> 
                            <td className='value'>{ withCommas( total ) } m<sup>3</sup></td>
                        </tr>
                        { reservoirsRepr.map( ( reservoir, i ) =>
                            <tr key={ i }>
                                <td>{ reservoir.name }</td>
                                <td className='value'>{ withCommas( reservoir.quantity )} m<sup>3</sup></td> 
                                <td className='value'>{ `${reservoir.percent}%` }</td>
                            </tr>
                        ) }
                    </tbody>
                </table>

            </div>
      );
    }
  
    return null;
};

export default ChartContent;