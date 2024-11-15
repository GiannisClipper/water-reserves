"use client"

import { SingleStandardTooltip, SpatialInterruptionsTooltip } from '@/components/page/chart/tooltips';
import { StandardLineChart, StandardAreaChart, StandardBarChart } from '@/components/page/chart/StandardChart';
import { StandardChartLayoutHandler } from '@/logic/LayoutHandler/chart/_abstract';
import { XAxisSpatialTick } from '../ticks';
import { getClusterColorCell } from '../cells';
import type { ObjectType } from '@/types';
import "@/styles/chart.css";

type Props1Type = { 
    chartType: string | undefined
    layoutHandler: StandardChartLayoutHandler
}

const InterruptionsTemporalChartContent = ( { chartType, layoutHandler }: Props1Type ) => {

    console.log( "rendering: ChartContent...", layoutHandler )

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
    layoutHandler: StandardChartLayoutHandler
}

const InterruptionsSpatialChartContent = ( { chartType, layoutHandler }: Props2Type ) => {

    console.log( "rendering: ChartContent..." )

    return (
        <div className="ChartContent" >

            {/* { chartType === 'bar'
            ? */}
            <StandardBarChart
                layoutHandler={ layoutHandler }
                CustomXAxisTick={ XAxisSpatialTick }
                CustomTooltip={ SpatialInterruptionsTooltip }
                cellFunc={ getClusterColorCell }
            />

            {/* :
            null
            } */}
        </div>
    );
}

type PropsType = { 
    dataBox: ObjectType
    chartType: string | undefined
    layoutHandler: StandardChartLayoutHandler
}

const InterruptionsChartContent = ( { dataBox, chartType, layoutHandler }: PropsType ) => {

    switch ( dataBox.type ) {

        case 'standard':
            return ( <InterruptionsTemporalChartContent
                chartType={ chartType }
                layoutHandler={ layoutHandler }
            /> );

        case 'standard,spatial':
            return ( <InterruptionsSpatialChartContent
                chartType={ chartType }
                layoutHandler={ layoutHandler }
            /> );

        default:
            return null;
    }

}

export { InterruptionsChartContent, InterruptionsTemporalChartContent, InterruptionsSpatialChartContent };