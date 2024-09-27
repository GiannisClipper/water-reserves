"use client"

import { useState, useEffect } from "react";

import ChartLabel from "./ChartLabel";
import SingleChartContent from "@/components/page/chart/SingleChartContent";
import StackChartContent from "@/components/page/chart/StackChartContent";
import MultiChartContent from "@/components/page/chart/MultiChartContent";

import { makeDataHandler } from "@/logic/DataHandler";
import { ChartTextsFactory } from "@/logic/ChartTexts";
import BrowserUrl from "@/helpers/url/BrowserUrl";

import type { SearchParamsType } from "@/types/searchParams";
import type { RequestResultType } from "@/types/requestResult";
import type { ObjectType } from "@/types";

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

    const chartTexts: ObjectType = new ChartTextsFactory( endpoint, searchParams )
        .chartTexts
        .toJSON();

    const [ chartType, setChartType ] = useState<string | undefined>( searchParams.chart_type );

    useEffect( () => {
        new BrowserUrl( window )
            .setParam( 'chart_type', chartType )
            .updateQueryString();
    }, [ chartType ] );

    // await new Promise( resolve => setTimeout( resolve, 3000 ) )
    // const result: number = Math.floor( Math.random() * 10 );

    console.log( "rendering: ChartSection..." )//, dataHandler.toJSON() )

    return (
        <div className="ChartSection">
            <ChartLabel 
                setChartType={ setChartType }
            />

            <ChartContent 
                dataHandler={ dataHandler }
                chartType={ chartType }
                chartTexts={ chartTexts }
            />
        </div>
    );
}

export default ChartSection;