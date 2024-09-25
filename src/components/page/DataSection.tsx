import { Suspense } from "react";

import type { SearchParamsType } from "@/types/searchParams";

import { ChartSectionSkeleton, ListSectionSkeleton } from "@/components/page/Skeleton";
import Error from "@/components/page/Error";
import ChartSection from "./chart/ChartSection";
import ListSection from "./list/ListSection";
import { DataRequestHandler } from "@/logic/DataRequestHandler";

type PropsType = { 
    endpoint: string
    searchParams: SearchParamsType 
}

const DataSection = async ( { endpoint, searchParams }: PropsType ) => {

    const requestHandler = await new DataRequestHandler( endpoint, searchParams );
    const { error, result } = requestHandler.toJSON();
    
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
            <ChartSection 
                endpoint={ endpoint }
                searchParams={ searchParams }
                result={ result }
            />
            <Suspense fallback={<ListSectionSkeleton />}>
                <ListSection 
                    endpoint={ endpoint }
                    searchParams={ searchParams }
                    result={ result }
                />
            </Suspense>
        </div>
    );
}

export default DataSection;