"use client"

import { useState, useEffect } from "react";

import ChartLabel from "@/components/Page/Chart/ChartLabel";
import ChartContentAggr from "./ChartContentAggr";
import ChartContentNonAggr from "./ChartContentNonAggr";
import BrowserParams from "@/helpers/url/BrowserUrl";
import type { SavingsSearchParamsType } from "@/types/searchParams";
import type { RequestResultType } from "@/types/requestResult";

type PropsType = { 
    searchParams: SavingsSearchParamsType
    result: RequestResultType | null 
}

const ChartSection = ( { searchParams, result }: PropsType  ) => {

    const reservoirAggregation: string | undefined = searchParams.reservoir_aggregation;

    const [ chartType, setChartType ] = useState<string | undefined>( searchParams.chart_type );

    useEffect( () => {
        new BrowserParams( window )
            .setParam( 'chart_type', chartType )
            .update();
    } );

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