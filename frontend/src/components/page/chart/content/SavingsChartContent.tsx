"use client"

import { SingleStandardTooltip } from '@/components/page/chart/tooltips';
import { StandardAreaChart, StandardBarChart, StandardLineChart } from '@/components/page/chart/StandardChart';
import { StackAreaChart, StackBarChart, StackLineChart } from '@/components/page/chart/StackChart';
import { StackChartLayoutHandler, StandardChartLayoutHandler } from '@/logic/LayoutHandler/chart/_abstract';
import type { ObjectType } from '@/types';
import "@/styles/chart.css";
import { SavingsStandardLegend } from '../legends';

type Props1Type = { 
    chartType: string | undefined
    layoutHandler: StandardChartLayoutHandler
}

const SavingsAggregatedChartContent = ( { chartType, layoutHandler }: Props1Type ) => {

    console.log( "rendering: ChartContent..." )

    return (
        <div className="ChartContent">

            { chartType === 'line'
            ?
            <StandardLineChart
                layoutHandler={ layoutHandler }
                CustomLegend={ SavingsStandardLegend }                
                CustomTooltip={ SingleStandardTooltip }                
            />

            :
            chartType === 'area'
            ?
            <StandardAreaChart
                layoutHandler={ layoutHandler }
                CustomLegend={ SavingsStandardLegend }                
                CustomTooltip={ SingleStandardTooltip }                
            />

            : chartType === 'bar'
            ?
            <StandardBarChart
                layoutHandler={ layoutHandler }
                CustomLegend={ SavingsStandardLegend }                
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

const SavingsSeparatedChartContent = ( { chartType, layoutHandler }: Props2Type ) => {

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
    dataBox: ObjectType
    chartType: string | undefined
    layoutHandler: StandardChartLayoutHandler | StackChartLayoutHandler
}

const SavingsChartContent = ( { dataBox, chartType, layoutHandler }: PropsType ) => {

    switch ( dataBox.type ) {

        case 'standard':
            return ( <SavingsAggregatedChartContent
                chartType={ chartType }
                layoutHandler={ layoutHandler as StandardChartLayoutHandler }
            /> );

        case 'stack':
            return ( <SavingsSeparatedChartContent
                chartType={ chartType }
                layoutHandler={ layoutHandler as StackChartLayoutHandler }
            /> );

        default:
            return null;
    }

}

export { SavingsChartContent, SavingsAggregatedChartContent, SavingsSeparatedChartContent };