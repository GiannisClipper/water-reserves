"use client"

import SingleChartContent from "@/components/page/chart/SingleChartContent";
import StackChartContent from "@/components/page/chart/StackChartContent";
import MultiChartContent from "@/components/page/chart/MultiChartContent";
import { DataHandlerFactory } from "@/logic/DataHandler";
import { MetadataHandlerFactory } from "@/logic/MetadataHandler";

import type { ObjectType } from "@/types";
import type { SearchParamsType } from "@/types/searchParams";
import type { RequestResultType } from "@/types/requestResult";

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
        'stack': StackChartContent,
        'multi': MultiChartContent,
    };
    const ChartContent = chartContents[ dataHandler.type ];

    const chartType = searchParams.chart_type;

    const metadataHandler: ObjectType = new MetadataHandlerFactory( endpoint, searchParams )
        .metadataHandler
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
                metadataHandler={ metadataHandler }
            />
        </div>
    );
}

export default ChartSection;