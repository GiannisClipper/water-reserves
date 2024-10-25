"use client"

import { MultiStandardTooltip } from '@/components/page/chart/tooltips';

import { StandardDataParser } from '@/logic/DataParser/StandardDataParser';

import { StandardAreaChart, StandardBarChart, StandardLineChart } from '@/components/page/chart/StandardChart';
import { StackChartLayoutHandler, StandardChartLayoutHandler } from '@/logic/LayoutHandler/chart/_abstract';

import "@/styles/chart.css";

type Props1Type = { 
    chartType: string | undefined
    layoutHandler: StandardChartLayoutHandler
}

const SavingsProductionAggregatedChartContent = ( { chartType, layoutHandler }: Props1Type ) => {

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

const SavingsProductionChartContent = ( { dataParser, chartType, layoutHandler }: PropsType ) => {

    switch ( dataParser.type ) {

        case 'standard':
            return ( <SavingsProductionAggregatedChartContent
                chartType={ chartType }
                layoutHandler={ layoutHandler as StandardChartLayoutHandler }
            /> );

        default:
            return null;
    }

}

export { SavingsProductionChartContent, SavingsProductionAggregatedChartContent };