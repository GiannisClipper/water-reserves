"use client"

import { LineChart, Line } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Customized, Label } from 'recharts';

import { TopTitle, XAxisLabel, YAxisLabel } from '@/components/Page/Chart/labels';
import { XAxisTick, YAxisTick } from '@/components/Page/Chart/ticks';
import { SimpleTooltip } from '@/components/Page/Chart/tooltips';

import { SavingsDataParser } from '@/logic/_common/DataParser';
import { ChartHandler } from '@/logic/_common/ChartHandler';

import { SKY } from '@/helpers/colors';
import { setFunctionOnDelay } from "@/helpers/time";
import { getAspect } from "@/logic/_common/chart";

import type { ObjectType } from '@/types';
import type { LineType } from '@/logic/savings/_common';
import type { RequestResultType } from "@/types/requestResult";

import "@/styles/chart.css";

type PropsType = { 
    result: RequestResultType | null
    chartType: string | undefined
    chartLabels: ObjectType
}

const ChartContent = ( { result, chartType, chartLabels }: PropsType ) => {

    const data: ObjectType[] = new SavingsDataParser( result ).getData();
    const chartHandler = new ChartHandler( data );

    // const [ aspect, setAspect ] = useState( 0 );
    // const onResize = setFunctionOnDelay( () => getAspect( aspect, setAspect ), 100 );

    console.log( "rendering: ChartContent..." )

    return (
        <div className="ChartContent">

            { chartType === 'bar'
            ?
            <BarChartComposition
                chartHandler={ chartHandler }
                labels={ chartLabels }
                color={ SKY }
                // aspect={ aspect }
                // onResize={ onResize }
            />

            :
            chartType === 'area'
            ?
            <AreaChartComposition
                chartHandler={ chartHandler }
                labels={ chartLabels }
                color={ SKY }
                // aspect={ aspect }
                // onResize={ onResize }
            />

            :
            <LineChartComposition
                chartHandler={ chartHandler }
                labels={ chartLabels }
                color={ SKY }
                // aspect={ aspect }
                // onResize={ onResize }
            />
            }
        </div>
    );
}

type ChartCompositionPropsType = { 
    chartHandler: ChartHandler
    labels: ObjectType
    color: ObjectType
    // aspect: number
    // onResize: CallableFunction
}

const LineChartComposition = ( { chartHandler, labels, color, aspect, onResize }: ChartCompositionPropsType ) => {

    // <ResponsiveContainer width="100%" height="100%" aspect={ aspect } onResize={ onResize } >

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={ chartHandler.getData() }
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
                    ticks={ chartHandler.getXTicks() } 
                    interval={ 0 } 
                    tick={ <XAxisTick data={ chartHandler.getData() } /> }
                    label={ <XAxisLabel label={ labels.xLabel } /> }
                />

                <YAxis 
                    domain={ [ chartHandler.minYTick(), chartHandler.maxYTick() ] } 
                    ticks={ chartHandler.getYTicks() }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ chartHandler.getData() } /> }
                    label={ <YAxisLabel label={ labels.yLabel } /> }
                />

                <Tooltip 
                    content={ <SimpleTooltip /> } 
                />

                <Line 
                    dataKey="quantity"
                    type={ chartHandler.getLineType() } 
                    stroke={ SKY[ 500 ] } 
                    strokeWidth={ 2 } 
                    dot={ false }
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

const AreaChartComposition = ( { chartHandler, labels, color, aspect, onResize }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={ chartHandler.getData() }
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
                    ticks={ chartHandler.getXTicks() }
                    interval={ 0 } 
                    tick={ <XAxisTick data={ chartHandler.getData() } /> } 
                    label={ <XAxisLabel label={ labels.xLabel } /> }
                />

                <YAxis 
                    domain={ [ chartHandler.minYTick(), chartHandler.maxYTick() ] } 
                    ticks={ chartHandler.getYTicks() }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ chartHandler.getData() } /> }
                    label={ <YAxisLabel label={ labels.yLabel } /> }
                />

                <Tooltip 
                    content={ <SimpleTooltip /> } 
                />

                <Area 
                    dataKey="quantity"
                    type={ chartHandler.getLineType() } 
                    stroke={ SKY[ 400 ] } 
                    fill={ SKY[ 300 ] } 
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

const BarChartComposition = ( { chartHandler, labels, color, aspect, onResize }: ChartCompositionPropsType ) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={ chartHandler.getData() }
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
                    ticks={ chartHandler.getXTicks() }
                    interval={ 0 } 
                    tick={ <XAxisTick data={ chartHandler.getData() } /> } 
                    label={ <XAxisLabel label={ labels.xLabel } /> }
                />

                <YAxis 
                    domain={ [ chartHandler.minYTick(), chartHandler.maxYTick() ] } 
                    ticks={ chartHandler.getYTicks() }
                    interval={ 0 } 
                    tick={ <YAxisTick data={ chartHandler.getData() } /> }
                    label={ <YAxisLabel label={ labels.yLabel } /> }
                />

                <Tooltip 
                    cursor={{ fill: '#0369a1' }}
                    content={ <SimpleTooltip /> } 
                />

                <Bar 
                    dataKey="quantity" 
                    stroke={ SKY[ 400 ] } 
                    fill={ SKY[ 300 ] } 
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default ChartContent;