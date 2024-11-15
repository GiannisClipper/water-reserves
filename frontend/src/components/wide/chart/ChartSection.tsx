"use client"

// import MapContent from "@/components/page/chart/MapContent";
// import dynamic... to fix Server Error: ReferenceError: window is not defined
import dynamic from 'next/dynamic'
const MapContent = dynamic( () => import( '@/components/page/chart/MapContent' ), { ssr: false } )

import DataParserFactory from '@/logic/DataParser/DataParserFactory';
import ChartLayoutHandlerFactory from "@/logic/LayoutHandler/chart/ChartLayoutHandlerFactory";

import { SavingsChartContent } from "@/components/page/chart/content/SavingsChartContent";
import { ProductionChartContent } from "@/components/page/chart/content/ProductionChartContent";
import { PrecipitationChartContent } from "@/components/page/chart/content/PrecipitationChartContent";
import { TemperatureChartContent } from "@/components/page/chart/content/TemperatureChartContent";
import { InterruptionsChartContent } from "@/components/page/chart/content/InterruptionsChartContent";
import { SavingsProductionChartContent } from "@/components/page/chart/content/SavingsProductionChartContent";
import { SavingsPrecipitationChartContent } from '@/components/page/chart/content/SavingsPrecipitationChartContent';

import type { ObjectType } from "@/types";
import type { SearchParamsType } from "@/types/searchParams";
import type { RequestResultType } from "@/types/requestResult";

type PropsType = {
    endpoint: string
    searchParams: SearchParamsType
    dataBox: ObjectType
}

const ChartSection = ( { endpoint, searchParams, dataBox }: PropsType  ) => {

    const layoutHandler = new ChartLayoutHandlerFactory( endpoint, searchParams, dataBox )
        .handler;

    const chartContents: ObjectType = {
        'savings': SavingsChartContent,
        'production': ProductionChartContent,
        'precipitation': PrecipitationChartContent,
        'temperature': TemperatureChartContent,
        'interruptions': InterruptionsChartContent,
        'savings-production': SavingsProductionChartContent,
        'savings-precipitation': SavingsPrecipitationChartContent,
    };

    let ChartContent = chartContents[ endpoint ];

    const chartType: string = searchParams.chart_type || '';

    if ( chartType === 'map' ) {
        ChartContent = MapContent;
    }

    console.log( "rendering: ChartSection..." )

    return (
        <div className="ChartSection">
            <ChartContent 
                // toJSON() is used for serialization, considering the Error: 
                // Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. 
                // Classes or null prototypes are not supported.
                dataBox={ dataBox }
                chartType={ chartType }
                layoutHandler={ layoutHandler }
            />
        </div>
    );
}

export default ChartSection;