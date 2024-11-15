"use client"

import { useState, useEffect } from "react";

import MapContent from "@/components/page/chart/MapContent";
// import dynamic... to fix Server Error: ReferenceError: window is not defined
// import dynamic from 'next/dynamic'
// const MapContent = dynamic( () => import( './MapContent' ), { ssr: false } )

import BrowserUrl from "@/helpers/url/BrowserUrl";
import ChartLayoutHandlerFactory from "@/logic/LayoutHandler/chart/ChartLayoutHandlerFactory";

import StandardChartLabel from "./label/StandardChartLabel";
import { TemperatureChartLabel } from "./label/TemperatureChartLabel";
import { InterruptionsChartLabel } from "./label/InterruptionsChartLabel";

import { SavingsChartContent } from "./content/SavingsChartContent";
import { ProductionChartContent } from "./content/ProductionChartContent";
import { PrecipitationChartContent } from "./content/PrecipitationChartContent";
import { TemperatureChartContent } from "./content/TemperatureChartContent";
import { InterruptionsChartContent } from "./content/InterruptionsChartContent";
import { SavingsProductionChartContent } from "./content/SavingsProductionChartContent";
import { SavingsPrecipitationChartContent } from "./content/SavingsPrecipitationChartContent";

import type { SearchParamsType } from "@/types/searchParams";
import type { ObjectType } from "@/types";

type PropsType = {
    endpoint: string
    searchParams: SearchParamsType
    dataBox: ObjectType
}

const ChartSection = ( { endpoint, searchParams, dataBox }: PropsType  ) => {
    
    const layoutHandler = new ChartLayoutHandlerFactory( endpoint, searchParams, dataBox )
        .handler;

    const chartLabels: ObjectType = {
        'savings': StandardChartLabel,
        'production': StandardChartLabel,
        'precipitation': StandardChartLabel,
        'temperature': TemperatureChartLabel,
        'interruptions': InterruptionsChartLabel,
        'savings-production': StandardChartLabel,
        'savings-precipitation': StandardChartLabel,
    };

    const ChartLabel = chartLabels[ endpoint ];

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

    console.log( "rendering: ChartSection..." )//, layoutHandler )

    return (
        <div className="ChartSection">
            <ChartLabel 
                dataBox={ dataBox }
                setChartType={ setChartType }
            />

            <ChartContent 
                dataBox={ dataBox }
                layoutHandler={ layoutHandler }
                chartType={ chartType }
            />
        </div>
    );
}

export default ChartSection;