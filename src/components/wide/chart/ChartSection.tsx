import SingleChartContent from "@/components/page/chart/SingleChartContent";
import StackChartContent from "@/components/page/chart/StackChartContent";
import { makeDataHandler } from "@/logic/_common/DataHandler";
import { SavingsChartLabels } from "@/logic/_common/ChartLabels";

import type { SearchParamsType } from "@/types/searchParams";
import type { RequestResultType } from "@/types/requestResult";

type PropsType = {
    endpoint: string
    searchParams: SearchParamsType
    result: RequestResultType | null
}

const ChartSection = ( { endpoint, searchParams, result }: PropsType  ) => {

    const dataHandler = makeDataHandler( { endpoint, searchParams, result } );
    
    console.log( JSON.parse( JSON.stringify( dataHandler ) ) )

    const ChartContent: any = dataHandler.type === 'single'
        ? SingleChartContent
        : StackChartContent;

    const chartType = searchParams.chart_type;

    const chartLabels = new SavingsChartLabels( searchParams ).getAsObject();

    console.log( "rendering: ChartSection..." )

    return (
        <div className="ChartSection">
            <ChartContent 
                // toJSON() is used for serialization, considering the Error: 
                // Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. 
                // Classes or null prototypes are not supported.
                dataHandler={ dataHandler.toJSON() }
                chartType={ chartType }
                chartLabels={ chartLabels }
            />
        </div>
    );
}

export default ChartSection;