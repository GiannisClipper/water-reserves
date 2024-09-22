import ChartContentAggr from "../ChartContentAggr";
import ChartContentNonAggr from "../ChartContentNonAggr";
import { SavingsChartLabels } from "@/logic/_common/ChartLabels";

import type { SavingsSearchParamsType } from "@/types/searchParams";
import type { RequestResultType } from "@/types/requestResult";

type PropsType = { 
    searchParams: SavingsSearchParamsType
    result: RequestResultType | null 
}

const ChartSection = ( { searchParams, result }: PropsType  ) => {

    const reservoirAggregation: string | undefined = searchParams.reservoir_aggregation;

    const chartType = searchParams.chart_type;

    const chartLabels = new SavingsChartLabels( searchParams ).getAsObject();

    console.log( "rendering: ChartSection..." )

    return (
        <div className="ChartSection">

            { reservoirAggregation 
            ? 
                <ChartContentAggr 
                    result={ result } 
                    chartType={ chartType }
                    chartLabels={ chartLabels }
                />
            : 
                <ChartContentNonAggr
                    result={ result } 
                    chartType={ chartType }
                    chartLabels={ chartLabels }
                />
            }
        </div>
    );
}

export default ChartSection;