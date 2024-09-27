import SingleChartContent from "@/components/page/chart/SingleChartContent";
import StackChartContent from "@/components/page/chart/StackChartContent";
import MultiChartContent from "@/components/page/chart/MultiChartContent";
import { makeDataHandler } from "@/logic/DataHandler";
import { ChartTextsFactory } from "@/logic/ChartTexts";

import type { ObjectType } from "@/types";
import type { SearchParamsType } from "@/types/searchParams";
import type { RequestResultType } from "@/types/requestResult";

type PropsType = {
    endpoint: string
    searchParams: SearchParamsType
    result: RequestResultType | null
}

const ChartSection = ( { endpoint, searchParams, result }: PropsType  ) => {

    let dataHandler: any
    if ( endpoint !== 'savings-production' ) {
        dataHandler = makeDataHandler( { endpoint, searchParams, result } );
    } else {
        dataHandler = makeDataHandler( { endpoint, searchParams, result, valueKeys: [ 'savings', 'production' ] } );
    }

    const chartContents: ObjectType = {
        'single': SingleChartContent,
        'stack': StackChartContent,
        'multi': MultiChartContent,
    };
    const ChartContent = chartContents[ dataHandler.type ];

    const chartType = searchParams.chart_type;

    const chartTexts: ObjectType = new ChartTextsFactory( endpoint, searchParams )
        .chartTexts
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
                chartTexts={ chartTexts }
            />
        </div>
    );
}

export default ChartSection;