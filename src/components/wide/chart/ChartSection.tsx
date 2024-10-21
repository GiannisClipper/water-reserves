"use client"

// import MapContent from "@/components/page/chart/MapContent";
// to fix Server Error: ReferenceError: window is not defined
import dynamic from 'next/dynamic'
const MapContent = dynamic( () => import( '@/components/page/chart/MapContent' ), { ssr: false } )

import SingleChartContent from "@/components/page/chart/SingleChartContent";
import StackChartContent from "@/components/page/chart/StackChartContent";
import MultiChartContent from "@/components/page/chart/MultiChartContent";
import DataHandlerFactory from "@/logic/DataHandler/DataHandlerFactory";
import ChartLayoutSpecifierFactory from "@/logic/LayoutSpecifier/ChartLayoutSpecifierFactory";

import type { ObjectType } from "@/types";
import type { SearchParamsType } from "@/types/searchParams";
import type { RequestResultType } from "@/types/requestResult";
import TimelessChartContent from "@/components/page/chart/TimelessChartContent";

type PropsType = {
    endpoint: string
    searchParams: SearchParamsType
    result: RequestResultType | null
}

const ChartSection = ( { endpoint, searchParams, result }: PropsType  ) => {

    const dataHandler = new DataHandlerFactory( { endpoint, searchParams, result } )
        .dataHandler;

    const chartContents: ObjectType = {
        'single': SingleChartContent,
        'single,timeless': TimelessChartContent,
        'stack': StackChartContent,
        'multi': MultiChartContent,
    };

    let ChartContent = chartContents[ dataHandler.type ];

    const chartType: string = searchParams.chart_type || '';

    if ( chartType === 'map' ) {
        ChartContent = MapContent;
    }

    const layoutSpecifier: ObjectType = new ChartLayoutSpecifierFactory( endpoint, searchParams )
        .layoutSpecifier
        .toJSON();

    console.log( "rendering: ChartSection..." )

    return (
        <div className="ChartSection">
            <ChartContent 
                // toJSON() is used for serialization, considering the Error: 
                // Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. 
                // Classes or null prototypes are not supported.
                dataHandler={ dataHandler }
                chartType={ chartType }
                layoutSpecifier={ layoutSpecifier }
            />
        </div>
    );
}

export default ChartSection;