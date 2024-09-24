"use client"

import { useState, useEffect } from "react";

import ChartLabel from "@/components/Page/Chart/ChartLabel";
import SingleChartContent from "./SingleChartContent";
import StackChartContent from "./StackChartContent";
import BrowserUrl from "@/helpers/url/BrowserUrl";
import { SavingsChartLabels } from "@/logic/_common/ChartLabels";
import type { SavingsSearchParamsType } from "@/types/searchParams";
import type { RequestResultType } from "@/types/requestResult";

type PropsType = { 
    searchParams: SavingsSearchParamsType
    result: RequestResultType | null 
}

const ChartSection = ( { searchParams, result }: PropsType  ) => {

    const reservoirAggregation: string | undefined = searchParams.reservoir_aggregation;

    const chartLabels = new SavingsChartLabels( searchParams ).getAsObject();

    const [ chartType, setChartType ] = useState<string | undefined>( searchParams.chart_type );

    useEffect( () => {
        new BrowserUrl( window )
            .setParam( 'chart_type', chartType )
            .updateQueryString();
    }, [ chartType ] );

    // await new Promise( resolve => setTimeout( resolve, 3000 ) )
    // const result: number = Math.floor( Math.random() * 10 );

    console.log( "rendering: ChartSection...", chartType )

    return (
        <div className="ChartSection">
            <ChartLabel 
                result={ result }
                setChartType={ setChartType }
            />

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