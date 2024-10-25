"use client"

// import MapContent from "@/components/page/chart/MapContent";
// import dynamic... to fix Server Error: ReferenceError: window is not defined
import dynamic from 'next/dynamic'
const MapContent = dynamic( () => import( '@/components/page/chart/MapContent' ), { ssr: false } )

import SingleChartContent from "@/components/page/chart/SingleChartContent";
import StackChartContent from "@/components/page/chart/StackChartContent";
import MultiChartContent from "@/components/page/chart/MultiChartContent";
import DataParserFactory from "@/logic/DataParser/DataParserFactory";

import ChartLayoutHandlerFactory from "@/logic/LayoutHandler/chart/ChartLayoutHandlerFactory";

import type { ObjectType } from "@/types";
import type { SearchParamsType } from "@/types/searchParams";
import type { RequestResultType } from "@/types/requestResult";

type PropsType = {
    endpoint: string
    searchParams: SearchParamsType
    result: RequestResultType | null
}

const ChartSection = ( { endpoint, searchParams, result }: PropsType  ) => {

    const dataParser = new DataParserFactory( { endpoint, searchParams, result } )
        .dataParser;

    const layoutHandler = new ChartLayoutHandlerFactory( endpoint, searchParams, dataParser ).handler;

    const chartContents: ObjectType = {
        'single': SingleChartContent,
        'single,spatial': SingleChartContent,
        'stack': StackChartContent,
        'multi': MultiChartContent,
    };

    let ChartContent = chartContents[ dataParser.type ];

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
                dataParser={ dataParser }
                chartType={ chartType }
                layoutHandler={ layoutHandler }
            />
        </div>
    );
}

export default ChartSection;