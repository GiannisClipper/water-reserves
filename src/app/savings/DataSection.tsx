import { Suspense } from "react";

import type { SearchParamsType } from "@/types/searchParams";

import { ChartSectionSkeleton, ListSectionSkeleton } from "@/components/Page/Skeleton";
import Error from "@/components/Page/Error";
import ChartSection from "./ChartSection";
import ListSection from "./ListSection";
import { RequestHandler } from "@/logic/_common/RequestHandler";

type PropsType = { 
    endpoint: string
    searchParams: SearchParamsType 
}

const DataSection = async ( { endpoint, searchParams }: PropsType ) => {

    const requestHandler = await new RequestHandler( endpoint, searchParams );
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