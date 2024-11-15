"use client"

import { SingleStandardTooltip } from '@/components/page/chart/tooltips';
import { StandardAreaChart, StandardBarChart, StandardLineChart } from '@/components/page/chart/StandardChart';
import { StackAreaChart, StackBarChart, StackLineChart } from '@/components/page/chart/StackChart';
import { StackChartLayoutHandler, StandardChartLayoutHandler } from '@/logic/LayoutHandler/chart/_abstract';
import { ProductionStandardLegend } from '../legends';
import type { ObjectType } from '@/types';
import "@/styles/chart.css";

type Props1Type = { 
    chartType: string | undefined
    layoutHandler: StandardChartLayoutHandler
}

const ProductionAggregatedChartContent = ( { chartType, layoutHandler }: Props1Type ) => {

    console.log( "rendering: ChartContent..." )

    return (
        <div className="ChartContent">

            { chartType === 'line'
            ?
            <StandardLineChart
                layoutHandler={ layoutHandler }
                CustomLegend={ ProductionStandardLegend }                
                CustomTooltip={ SingleStandardTooltip }                
            />

            :
            chartType === 'area'
            ?
            <StandardAreaChart
                layoutHandler={ layoutHandler }
                CustomLegend={ ProductionStandardLegend }                
                CustomTooltip={ SingleStandardTooltip }                
            />

            : chartType === 'bar'
            ?
            <StandardBarChart
                layoutHandler={ layoutHandler }
                CustomLegend={ ProductionStandardLegend }                
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

const ProductionSeparatedChartContent = ( { chartType, layoutHandler }: Props2Type ) => {

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

const ProductionChartContent = ( { dataBox, chartType, layoutHandler }: PropsType ) => {

    switch ( dataBox.type ) {

        case 'standard':
            return ( <ProductionAggregatedChartContent
                chartType={ chartType }
                layoutHandler={ layoutHandler as StandardChartLayoutHandler }
            /> );

        case 'stack':
            return ( <ProductionSeparatedChartContent
                chartType={ chartType }
                layoutHandler={ layoutHandler as StackChartLayoutHandler }
            /> );

        default:
            return null;
    }

}

export { ProductionChartContent, ProductionAggregatedChartContent, ProductionSeparatedChartContent };