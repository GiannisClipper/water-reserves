import SingleChartContent from "../SingleChartContent";
import StackChartContent from "../StackChartContent";
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
                <SingleChartContent 
                    result={ result } 
                    chartType={ chartType }
                    chartLabels={ chartLabels }
                />
            : 
                <StackChartContent
                    result={ result } 
                    chartType={ chartType }
                    chartLabels={ chartLabels }
                />
            }
        </div>
    );
}

export default ChartSection;