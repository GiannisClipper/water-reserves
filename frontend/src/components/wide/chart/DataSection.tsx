import { ChartSectionSkeleton } from "@/components/page/Skeleton";
import Error from "@/components/page/Error";

// import ChartSection from "./chart/ChartSection";
// import dynamic... to fix Server Error: ReferenceError: window is not defined
import dynamic from 'next/dynamic'
const ChartSection = dynamic( () => import( './ChartSection' ), { ssr: false } )

import useApiRequest from "@/logic/useApiRequest";
import type { SearchParamsType } from "@/types/searchParams";

type PropsType = { 
    endpoint: string
    searchParams: SearchParamsType 
}

const DataSection = async ( { endpoint, searchParams }: PropsType ) => {

    // await new Promise( resolve => setTimeout( resolve, 2000 ) )

    const [ error, dataBox ] = await useApiRequest( { endpoint, searchParams } );

    console.log( "rendering: DataSection..." );

    return ( 
        
        ! error && ! dataBox
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
                dataBox={ dataBox }
            />
        </div>
    );
}

export default DataSection;