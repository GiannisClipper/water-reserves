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
import ChartLayoutSpecifierFactory from "@/logic/LayoutSpecifier/ChartLayoutSpecifierFactory";
import BrowserUrl from "@/helpers/url/BrowserUrl";

import type { SearchParamsType } from "@/types/searchParams";
import type { RequestResultType } from "@/types/requestResult";
import type { ObjectType } from "@/types";
import ParamValues from "@/logic/ParamValues";

type PropsType = {
    endpoint: string
    searchParams: SearchParamsType
    result: RequestResultType | null
}

const ChartSection = ( { endpoint, searchParams, result }: PropsType  ) => {

    const dataHandler = new DataHandlerFactory( { endpoint, searchParams, result } )
        .dataHandler;
    
    const layoutSpecifier: ObjectType = new ChartLayoutSpecifierFactory( endpoint, searchParams )
        .layoutSpecifier
        .toJSON();

    const chartLabels: ObjectType = {
        'single': ChartLabel1,
        'single,timeless': ChartLabel2,
        'stack': ChartLabel1,
        'multi': ChartLabel1,
    };

    const ChartLabel = chartLabels[ dataHandler.type ];

    const chartContents: ObjectType = {
        'single': SingleChartContent,
        'single,timeless': TimelessChartContent,
        'stack': StackChartContent,
        'multi': MultiChartContent,
    };

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

    console.log( "rendering: ChartSection...", result )//, dataHandler )//, dataHandler.toJSON() )

    return (
        <div className="ChartSection">
            <ChartLabel 
                setChartType={ setChartType }
            />

            <ChartContent 
                dataHandler={ dataHandler }
                layoutSpecifier={ layoutSpecifier }
                chartType={ chartType }
            />
        </div>
    );
}

export default ChartSection;