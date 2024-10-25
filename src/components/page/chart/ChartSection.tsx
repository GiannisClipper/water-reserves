"use client"

import { useState, useEffect } from "react";

// import MapContent from "@/components/page/chart/MapContent";
// import dynamic... to fix Server Error: ReferenceError: window is not defined
import dynamic from 'next/dynamic'
const MapContent = dynamic( () => import( './MapContent' ), { ssr: false } )


import DataParserFactory from "@/logic/DataParser/DataParserFactory";
import BrowserUrl from "@/helpers/url/BrowserUrl";
import ChartLayoutHandlerFactory from "@/logic/LayoutHandler/chart/ChartLayoutHandlerFactory";

import ChartLabel1 from "./ChartLabel";
import ChartLabel2 from "./ChartLabel2";

import { SavingsChartContent } from "./content/SavingsChartContent";
import { ProductionChartContent } from "./content/ProductionChartContent";
import { PrecipitationChartContent } from "./content/PrecipitationChartContent";
import { TemperatureChartContent } from "./content/TemperatureChartContent";
import { InterruptionsChartContent } from "./content/InterruptionsChartContent";
import { SavingsProductionChartContent } from "./content/SavingsProductionChartContent";
import { SavingsPrecipitationChartContent } from "./content/SavingsPrecipitationChartContent";

import type { SearchParamsType } from "@/types/searchParams";
import type { RequestResultType } from "@/types/requestResult";
import type { ObjectType } from "@/types";

type PropsType = {
    endpoint: string
    searchParams: SearchParamsType
    result: RequestResultType | null
}

const ChartSection = ( { endpoint, searchParams, result }: PropsType  ) => {

    const dataParser = new DataParserFactory( { endpoint, searchParams, result } )
        .dataParser;
    
    const layoutHandler = new ChartLayoutHandlerFactory( endpoint, searchParams, dataParser ).handler;

    const chartLabels: ObjectType = {
        'standard': ChartLabel1,
        'standard,spatial': ChartLabel2,
        'stack': ChartLabel1,
    };

    const ChartLabel = chartLabels[ dataParser.type ];

    const chartContents: ObjectType = {
        'savings': SavingsChartContent,
        'production': ProductionChartContent,
        'precipitation': PrecipitationChartContent,
        'temperature': TemperatureChartContent,
        'interruptions': InterruptionsChartContent,
        'savings-production': SavingsProductionChartContent,
        'savings-precipitation': SavingsPrecipitationChartContent,
    };

    let ChartContent = chartContents[ endpoint ];

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

    console.log( "rendering: ChartSection..." )//, ChartContent )

    return (
        <div className="ChartSection">
            <ChartLabel 
                setChartType={ setChartType }
            />

            <ChartContent 
                dataParser={ dataParser }
                layoutHandler={ layoutHandler }
                chartType={ chartType }
            />
        </div>
    );
}

export default ChartSection;