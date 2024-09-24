"use client"

import { useState, useEffect } from "react";

import ChartLabel from "@/components/Page/Chart/ChartLabel";
import SingleChartContent from "../../components/Page/Chart/SingleChartContent";
import StackChartContent from "../../components/Page/Chart/StackChartContent";

import { makeDataHandler } from "@/logic/_common/DataHandler";
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

    const dataHandler = makeDataHandler( { endpoint, searchParams, result } );

    // console.log( 'dataHandler', dataHandler.toJSON() );

    const ChartContent: any = dataHandler.type === 'single'
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
                dataHandler={ dataHandler }
                chartType={ chartType }
                chartLabels={ chartLabels }
            />
        </div>
    );
}

export default ChartSection;