import { ChartSectionSkeleton } from "@/components/page/Skeleton";
import Error from "@/components/page/Error";
import ChartSection from "./chart/ChartSection";

import { RequestMakerFactory } from "@/logic/RequestMaker/RequestMakerFactory";

import type { SearchParamsType } from "@/types/searchParams";

type PropsType = { 
    endpoint: string
    searchParams: SearchParamsType 
}

const DataSection = async ( { endpoint, searchParams }: PropsType ) => {

    // await new Promise( resolve => setTimeout( resolve, 2000 ) )

    let error = null, result = null;
    if ( Object.keys( searchParams ).length ) {
        const requestMakerCollection = new RequestMakerFactory( endpoint, searchParams ).requestMakerCollection;
        ( { error, result } = ( await requestMakerCollection.request() ).toJSON() );
    }  

    console.log( "rendering: DataSection..." );

    return ( 
        
        ! error && ! result
        ?
        <div className="DataSection">
            <ChartSectionSkeleton /> 
        </div>

        : error
        ? 
        <div className="DataSection">
            <ChartSectionSkeleton>
                <Error error={error} /> 
            </ChartSectionSkeleton>
        </div>

        :
        <div className="DataSection">
            <ChartSection 
                endpoint={ endpoint }
                searchParams={ searchParams }
                result={ result }
            />
        </div>
    );
}

export default DataSection;