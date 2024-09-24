"use client"

import { useState, useEffect } from "react";

import ChartLabel from "@/components/Page/Chart/ChartLabel";
import SingleChartContent from "../../components/Page/Chart/SingleChartContent";
import StackChartContent from "../../components/Page/Chart/StackChartContent";

import { makeDataContext } from "@/logic/_common/DataParser";
import BrowserUrl from "@/helpers/url/BrowserUrl";
import { SavingsChartLabels } from "@/logic/_common/ChartLabels";

import type { SearchParamsType } from "@/types/searchParams";
import { RequestResultType } from "@/types/requestResult";

type PropsType = {
    endpoint: string
    searchParams: SearchParamsType
    result: RequestResultType | null
}

const ChartSection = ( { endpoint, searchParams, result }: PropsType  ) => {

    const { displayMode, itemsKey, dataParser } = makeDataContext( { endpoint, searchParams, result } );
    
    const ChartContent: any = displayMode === 'single'
        ? SingleChartContent
        : StackChartContent;

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
                setChartType={ setChartType }
            />

            <ChartContent 
                dataParser={ dataParser }
                chartType={ chartType }
                chartLabels={ chartLabels }
            />
        </div>
    );
}

export default ChartSection;