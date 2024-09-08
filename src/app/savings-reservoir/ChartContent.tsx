"use client";

import { LineChart, Line, Legend } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { BarChart, Bar, Rectangle } from 'recharts';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { RequestResultType } from "@/types/requestResult";
import { getYTicks, getXTicks } from '@/helpers/charts';
import { commaView } from '@/helpers/numbers';
import { CustomizedXAxisTick } from '@/components/Page/Chart';
import { timeLabel } from '@/helpers/time';
import { WATER_COLOR } from '../settings';
import { ObjectType } from '@/types';
import ObjectList from '@/helpers/ObjectList';

import "@/styles/chart.css";

type TooltipPropsType = {
    active?: boolean
    payload?: any
    label?: string
    reservoirs: ObjectType[]
} 

const CustomTooltip = ( { active, payload, label, reservoirs }: TooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        const { time, ...quantities } = payload[ 0 ].payload;

        return (
            <div className="Tooltip">
                <p>{ `${timeLabel( time )}: ${time}` }</p>
                { reservoirs.map( ( r, i ) => 
                    Object.keys( quantities ).includes( r.name_el )
                        ? <p key={ i }>{ `${ r.name_el}: ${commaView( quantities[ r.name_el ] )} κμ` }</p> 
                        : null
                ) }
            </div>
      );
    }
  
    return null;
};

type PropsType = { 
    result: RequestResultType | null
    chartType: string | undefined
}

const ChartContent = ( { result, chartType }: PropsType ) => {

    const headers: string[] = result && result.headers || [];
    let data: any[][] = result && result.data || [];
    let reservoirs: ObjectType[] = result && result.legend && result.legend.reservoirs || [];
    reservoirs = new ObjectList( reservoirs ).sortBy( 'start', 'desc' );

    // TODO: refactor data2 calculation

    data = data.map( row => {
        // to exclude the 1st position (id) if exists
        if ( row.length === 4 ) {
            return row.slice( 1, );
        }
        return row
    } );

    const timeObj: { [ key: string ]: any } = {};
    for ( let row of data ) {
        // console.log( 'row', row );
        if ( ! timeObj[ row[ 0 ] ] ) {
            timeObj[ row[ 0 ] ] = { time: row[ 0 ] };
        }
        const reservoir: ObjectType | null = new ObjectList( reservoirs ).findOne( 'id', row[ 1 ] );
        const qLabel: string = ( reservoir && reservoir.name_el ) || ( `q${row[ 1 ]}` );
        timeObj[ row[ 0 ] ][ qLabel ] = row[ 2 ];
    }
    const data2 = Object.values( timeObj );

    const xTicks: string[] = getXTicks( data2.map( ( row: { [ key: string ]: any } ) => row.time ) );

    const lineType: 'linear' | 'monotone' = xTicks.length && xTicks[ 0 ].length === 10 ? 'linear' : 'monotone';

    const yValues = data.map( ( row: any[] ) => row[ 2 ] );

    const maxValue = Math.max( ...yValues );
    const minValue = Math.min( ...yValues );

    const yTicks = getYTicks( 
        minValue - minValue * .10, 
        maxValue + maxValue * .05 
    );
    
    const STROKES: string[] = [ "1 1", "2 2", "4 4", "8 8" ];

    console.log( "rendering: ChartContent...", data, data2 )

    return (
        <div className="ChartContent">
            <ResponsiveContainer height="100%" width="100%">

                { chartType === 'bar'
                ?
                <BarChart
                    data={data2}
                    margin={{ top: 20, right: 20, bottom: 60, left: 40 }}
                >
                    <CartesianGrid 
                        strokeDasharray="3 3" 
                    />

                    <XAxis 
                        dataKey="time" 
                        ticks={ xTicks } 
                        interval={ 0 } 
                        tick={ <CustomizedXAxisTick data={ data2 } /> } 
                    />

                    <YAxis 
                        domain={ [ yTicks[ 0 ], yTicks[ yTicks.length -1 ] ] } 
                        ticks={ yTicks } 
                        interval={ 0 } 
                        tickFormatter={ x => commaView( x ) } 
                    />

                    <Tooltip 
                        content={ <CustomTooltip reservoirs={ reservoirs } /> } 
                    />

                    { reservoirs.map( ( r, i ) =>
                        <Bar 
                            key={ i } 
                            type={ lineType } 
                            dataKey={ r.name_el }
                            stackId="a"
                            stroke={ WATER_COLOR[ i ] } 
                            strokeWidth={ 0 }
                            fill={ WATER_COLOR[ i ] } 
                            fillOpacity={ 1 }
                        />
                    ) }

                    <Legend 
                        align="right" 
                        verticalAlign='top' 
                    />
                </BarChart>

                :
                chartType === 'area'
                ?
                <AreaChart
                    data={data2}
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
                        tick={ <CustomizedXAxisTick data={ data2 } /> } 
                    />

                    <YAxis 
                        domain={ [ yTicks[ 0 ], yTicks[ yTicks.length -1 ] ] } 
                        ticks={ yTicks } 
                        interval={ 0 } 
                        tickFormatter={ x => commaView( x ) } 
                    />

                    {/* <YAxis tickFormatter={ decimal => `${(decimal * 100).toFixed( 0 )}%` } /> */}

                    <Tooltip 
                        content={ <CustomTooltip reservoirs={ reservoirs } /> } 
                    />

                    { reservoirs.map( ( r, i ) =>
                        <Area 
                            key={ i } 
                            type={ lineType } 
                            dataKey={ r.name_el }
                            stackId="a"
                            stroke={ WATER_COLOR[ i ] } 
                            fill={ WATER_COLOR[ i ] } 
                            fillOpacity={ .65 }                        />
                    ) }

                    <Legend 
                        align="right" 
                        verticalAlign='top' 
                    />
                </AreaChart>

                :
                <LineChart
                    data={data2}
                    margin={{ top: 20, right: 20, bottom: 60, left: 40 }}
                >
                    <CartesianGrid 
                        strokeDasharray="3 3" 
                    />

                    <XAxis 
                        dataKey="time" 
                        ticks={ xTicks } 
                        interval={ 0 } 
                        tick={ <CustomizedXAxisTick data={ data2 } /> } 
                    />

                    <YAxis 
                        domain={ [ yTicks[ 0 ], yTicks[ yTicks.length - 1 ] ] } 
                        ticks={ yTicks } 
                        interval={ 0 } 
                        tickFormatter={ x => commaView( x ) } 
                    />

                    <Tooltip 
                        content={ <CustomTooltip reservoirs={ reservoirs } /> } 
                    />

                    { reservoirs.map( ( r, i ) =>
                        <Line 
                            key={ i } 
                            type={ lineType } 
                            dataKey={ r.name_el } 
                            stroke={ WATER_COLOR[ 0 ] } 
                            strokeWidth={ 2 } 
                            strokeDasharray={ STROKES[ i ] }
                            dot={ false }
                            legendType="plainline"
                        />
                    ) }

                    <Legend 
                        align="right" 
                        verticalAlign='top' 
                    />
                </LineChart>
                }
                
            </ResponsiveContainer>
            {/* <span>-</span> */}
        </div>
    );

}

export default ChartContent;