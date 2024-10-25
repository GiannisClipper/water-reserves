"use client"

import { SingleStandardTooltip } from '@/components/page/chart/tooltips';

import { StandardDataParser } from '@/logic/DataParser/StandardDataParser';

import "@/styles/chart.css";
import { StandardAreaChart, StandardBarChart, StandardLineChart } from '@/components/page/chart/StandardChart';
import { StackAreaChart, StackBarChart, StackLineChart } from '@/components/page/chart/StackChart';
import { StackChartLayoutHandler, StandardChartLayoutHandler } from '@/logic/LayoutHandler/chart/_abstract';

type Props1Type = { 
    chartType: string | undefined
    layoutHandler: StandardChartLayoutHandler
}

const PrecipitationAggregatedChartContent = ( { chartType, layoutHandler }: Props1Type ) => {

    console.log( "rendering: ChartContent..." )

    return (
        <div className="ChartContent">

            { chartType === 'line'
            ?
            <StandardLineChart
                layoutHandler={ layoutHandler }
                CustomTooltip={ SingleStandardTooltip }                
            />

            :
            chartType === 'area'
            ?
            <StandardAreaChart
                layoutHandler={ layoutHandler }
                CustomTooltip={ SingleStandardTooltip }                
            />

            : chartType === 'bar'
            ?
            <StandardBarChart
                layoutHandler={ layoutHandler }
                CustomTooltip={ SingleStandardTooltip }
            />

            :
            null
            }
        </div>
    );
}

type Props2Type = { 
    chartType: string | undefined
    layoutHandler: StackChartLayoutHandler
}

const PrecipitationSeparatedChartContent = ( { chartType, layoutHandler }: Props2Type ) => {

    console.log( "rendering: ChartContent..." )

    return (
        <div className="ChartContent">

            { chartType === 'line'
            ?
            <StackLineChart
                layoutHandler={ layoutHandler }
            />

            :
            chartType === 'area'
            ?
            <StackAreaChart
                layoutHandler={ layoutHandler }
            />

            : chartType === 'bar'
            ?
            <StackBarChart
                layoutHandler={ layoutHandler }
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

const PrecipitationChartContent = ( { dataParser, chartType, layoutHandler }: PropsType ) => {

    switch ( dataParser.type ) {

        case 'standard':
            return ( <PrecipitationAggregatedChartContent
                chartType={ chartType }
                layoutHandler={ layoutHandler as StandardChartLayoutHandler }
            /> );

        case 'stack':
            return ( <PrecipitationSeparatedChartContent
                chartType={ chartType }
                layoutHandler={ layoutHandler as StackChartLayoutHandler }
            /> );

        default:
            return null;
    }

}

export { PrecipitationChartContent, PrecipitationAggregatedChartContent, PrecipitationSeparatedChartContent };