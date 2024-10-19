"use client"

import { useState, useEffect } from "react";

import ChartLabel1 from "./ChartLabel";
import ChartLabel2 from "./ChartLabel2";

import TimelessChartContent from "@/components/page/chart/TimelessChartContent";
import SingleChartContent from "@/components/page/chart/SingleChartContent";
import StackChartContent from "@/components/page/chart/StackChartContent";
import MultiChartContent from "@/components/page/chart/MultiChartContent";

// import MapContent from "@/components/page/chart/MapContent";
// to fix Server Error: ReferenceError: window is not defined
import dynamic from 'next/dynamic'
const MapContent = dynamic( () => import( './MapContent' ), { ssr: false } )

import DataHandlerFactory from "@/logic/DataHandler/DataHandlerFactory";
import { MetadataHandlerFactory } from "@/logic/MetadataHandler";
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

    const dataHandler = new DataHandlerFactory( { endpoint, searchParams, result } )
        .dataHandler;

    const metadataHandler: ObjectType = new MetadataHandlerFactory( endpoint, searchParams )
        .metadataHandler
        .toJSON();

    const chartLabels: ObjectType = {
        'timeless': ChartLabel2,
        'single': ChartLabel1,
        'stack': ChartLabel1,
        'multi': ChartLabel1,
    };
    
    const chartContents: ObjectType = {
        'timeless': TimelessChartContent,
        'single': SingleChartContent,
        'stack': StackChartContent,
        'multi': MultiChartContent,
    };

    let ChartLabel = chartLabels[ dataHandler.type ];
    let ChartContent = chartContents[ dataHandler.type ];

    const [ chartType, setChartType ] = useState<string | undefined>( searchParams.chart_type );

    if ( chartType === 'map' ) {
        ChartContent = MapContent;
    }

    useEffect( () => {
        new BrowserUrl( window )
            .setParam( 'chart_type', chartType )
            .updateQueryString();
    }, [ chartType ] );

    // await new Promise( resolve => setTimeout( resolve, 3000 ) )
    // const result: number = Math.floor( Math.random() * 10 );

    console.log( "rendering: ChartSection...", dataHandler )//, dataHandler.toJSON() )

    return (
        <div className="ChartSection">
            <ChartLabel 
                setChartType={ setChartType }
            />

            <ChartContent 
                dataHandler={ dataHandler }
                metadataHandler={ metadataHandler }
                chartType={ chartType }
            />
        </div>
    );
}

export default ChartSection;