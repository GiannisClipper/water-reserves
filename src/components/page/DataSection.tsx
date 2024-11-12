import { Suspense } from "react";

import { ChartSectionSkeleton, ListSectionSkeleton } from "@/components/page/Skeleton";
import Error from "@/components/page/Error";

// import ChartSection from "@/components/page/chart/ChartSection";
// import dynamic... to fix Server Error: ReferenceError: window is not defined
import dynamic from 'next/dynamic'
const ChartSection = dynamic( () => import( './chart/ChartSection' ), { ssr: false } )

import ListSection from "./list/ListSection";
import useApiRequest from "@/logic/useApiRequest";
import type { SearchParamsType } from "@/types/searchParams";

type PropsType = { 
    endpoint: string
    searchParams: SearchParamsType 
}

const DataSection = async ( { endpoint, searchParams }: PropsType ) => {

    const [ error, dataBox ] = await useApiRequest( { endpoint, searchParams } );

    console.log( "rendering: DataSection..." );

    return ( 

        ! error && ! dataBox
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
            {/* <Suspense fallback={"<div>W ai i t i n g . . . </div>"}> */}
                <ChartSection 
                    endpoint={ endpoint }
                    searchParams={ searchParams }
                    dataBox={ dataBox }
                />
            </Suspense>
            <Suspense fallback={<ListSectionSkeleton />}>
                <ListSection 
                    endpoint={ endpoint }
                    searchParams={ searchParams }
                    dataBox={ dataBox }
                />
            </Suspense>
        </div>
    );
}

export default DataSection;