"use client"

import { useState, useEffect } from "react";

import ChartLabel from "@/components/page/chart/ChartLabel";
import SingleChartContent from "@/components/page/chart/SingleChartContent";
import StackChartContent from "@/components/page/chart/StackChartContent";

import { makeDataHandler } from "@/logic/DataHandler";
import { SavingsChartTexts, ProductionChartTexts, PrecipitationChartTexts } from "@/logic/ChartTexts";
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

    const dataHandler = makeDataHandler( { endpoint, searchParams, result } );

    // console.log( 'dataHandler', dataHandler.toJSON() );

    const ChartContent: any = dataHandler.type === 'single'
        ? SingleChartContent
        : StackChartContent;

    let chartTexts: ObjectType;

    switch ( endpoint ) {

        case 'savings': {
            chartTexts = new SavingsChartTexts( searchParams ).toJSON();
            break;
        } 
        case 'production': {
            chartTexts = new ProductionChartTexts( searchParams ).toJSON();
            break;
        }
        case 'precipitation': {
            chartTexts = new PrecipitationChartTexts( searchParams ).toJSON();
            break;
        }
        default:
            throw `Invalid endpoint (${endpoint}) used in <ChartSection/>`;
    }

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
                chartTexts={ chartTexts }
            />
        </div>
    );
}

export default ChartSection;