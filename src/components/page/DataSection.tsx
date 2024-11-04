import { Suspense } from "react";

import { ChartSectionSkeleton, ListSectionSkeleton } from "@/components/page/Skeleton";
import Error from "@/components/page/Error";

// import ChartSection from "@/components/page/chart/ChartSection";
// import dynamic... to fix Server Error: ReferenceError: window is not defined
import dynamic from 'next/dynamic'
const ChartSection = dynamic( () => import( './chart/ChartSection' ), { ssr: false } )

import ListSection from "./list/ListSection";

import { RequestMakerFactory } from "@/logic/RequestMaker/RequestMakerFactory";
import DataParserFactory from "@/logic/DataParser/DataParserFactory";
import type { SearchParamsType } from "@/types/searchParams";

type PropsType = { 
    endpoint: string
    searchParams: SearchParamsType 
}

const DataSection = async ( { endpoint, searchParams }: PropsType ) => {

    let error = null, result = null;
    let dataParser: any;

    if ( Object.keys( searchParams ).length ) {
        const requestMakerCollection = new RequestMakerFactory( endpoint, searchParams ).requestMakerCollection;
        ( { error, result } = ( await requestMakerCollection.request() ).toJSON() );

        if ( ! error ) {
            dataParser = new DataParserFactory( { endpoint, searchParams, result } )
                .dataParser;
        }
    }  

    console.log( "rendering: DataSection..." );

    return ( 

        ! error && ! result
        ?
        <div className="DataSection">
            <ChartSectionSkeleton /> 
            <ListSectionSkeleton />
        </div>

        : error
        ? 
        <div className="DataSection">
            <ChartSectionSkeleton>
                <Error error={error} /> 
            </ChartSectionSkeleton>
            <ListSectionSkeleton />
        </div>

        :
        <div className="DataSection">
            <Suspense fallback={<ChartSectionSkeleton />}>
                <ChartSection 
                    endpoint={ endpoint }
                    searchParams={ searchParams }
                    result={ result }
                />
            </Suspense>
            <Suspense fallback={<ListSectionSkeleton />}>
                <ListSection 
                    endpoint={ endpoint }
                    searchParams={ searchParams }
                    result={ result }
                    dataParser={ dataParser }
                />
            </Suspense>
        </div>
    );
}

export default DataSection;