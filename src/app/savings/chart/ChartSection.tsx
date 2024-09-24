import SingleChartContent from "../../../components/Page/Chart/SingleChartContent";
import StackChartContent from "../../../components/Page/Chart/StackChartContent";
import { makeDataContext } from "@/logic/_common/DataParser";
import { SavingsChartLabels } from "@/logic/_common/ChartLabels";

import type { SearchParamsType } from "@/types/searchParams";
import type { RequestResultType } from "@/types/requestResult";

type PropsType = {
    endpoint: string
    searchParams: SearchParamsType
    result: RequestResultType | null
}

const ChartSection = ( { endpoint, searchParams, result }: PropsType  ) => {

    const { displayMode, itemsKey, dataParser } = makeDataContext( { endpoint, searchParams, result } );
    
    console.log( JSON.parse( JSON.stringify( dataParser ) ) )

    const ChartContent: any = displayMode === 'single'
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
                dataParser={ dataParser.toJSON() }
                chartType={ chartType }
                chartLabels={ chartLabels }
            />
        </div>
    );
}

export default ChartSection;