import ChartContentAggr from "../ChartContentAggr";
import ChartContentNonAggr from "../ChartContentNonAggr";

import type { SavingsSearchParamsType } from "@/types/searchParams";
import type { RequestResultType } from "@/types/requestResult";

type PropsType = { 
    searchParams: SavingsSearchParamsType
    result: RequestResultType | null 
}

const ChartSection = ( { searchParams, result }: PropsType  ) => {

    const reservoirAggregation: string | undefined = searchParams.reservoir_aggregation;

    const chartType = searchParams.chart_type;

    console.log( "rendering: ChartSection..." )

    return (
        <div className="ChartSection">

            { reservoirAggregation 
            ? 
                <ChartContentAggr 
                    result={ result } 
                    chartType={ chartType }
                />
            : 
                <ChartContentNonAggr
                    result={ result } 
                    chartType={ chartType }
                />
            }
        </div>
    );
}

export default ChartSection;