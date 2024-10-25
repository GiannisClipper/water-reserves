"use client"

import { MultiStandardTooltip } from '@/components/page/chart/tooltips';

import { StandardDataParser } from '@/logic/DataParser/StandardDataParser';

import "@/styles/chart.css";
import { StandardAreaChart, StandardBarChart, StandardLineChart } from '@/components/page/chart/StandardChart';
import { StackChartLayoutHandler, StandardChartLayoutHandler } from '@/logic/LayoutHandler/chart/_abstract';

type Props1Type = { 
    chartType: string | undefined
    layoutHandler: StandardChartLayoutHandler
}

const TemperatureAggregatedChartContent = ( { chartType, layoutHandler }: Props1Type ) => {

    console.log( "rendering: ChartContent..." )

    return (
        <div className="ChartContent">

            { chartType === 'line'
            ?
            <StandardLineChart
                layoutHandler={ layoutHandler }
                CustomTooltip={ MultiStandardTooltip }                
            />

            :
            chartType === 'area'
            ?
            <StandardAreaChart
                layoutHandler={ layoutHandler }
                CustomTooltip={ MultiStandardTooltip }                
            />

            : chartType === 'bar'
            ?
            <StandardBarChart
                layoutHandler={ layoutHandler }
                CustomTooltip={ MultiStandardTooltip }
            />

            :
            null
            }
        </div>
    );
}

type PropsType = { 
    dataParser: StandardDataParser
    chartType: string | undefined
    layoutHandler: StandardChartLayoutHandler | StackChartLayoutHandler
}

const TemperatureChartContent = ( { dataParser, chartType, layoutHandler }: PropsType ) => {

    switch ( dataParser.type ) {

        case 'standard':
        case 'stack':
                return ( <TemperatureAggregatedChartContent
                chartType={ chartType }
                layoutHandler={ layoutHandler as StandardChartLayoutHandler }
            /> );

        default:
            return null;
    }

}

export { TemperatureChartContent, TemperatureAggregatedChartContent };