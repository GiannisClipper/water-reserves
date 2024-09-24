import type { SearchParamsType } from "@/types/searchParams";
import { ChartSectionSkeleton } from "@/components/Page/Skeleton";
import Error from "@/components/Page/Error";
import ChartSection from "./ChartSection";
import { RequestHandler } from "@/logic/_common/RequestHandler";

type PropsType = { 
    endpoint: string
    searchParams: SearchParamsType 
}

const DataSection = async ( { endpoint, searchParams }: PropsType ) => {

    // await new Promise( resolve => setTimeout( resolve, 2000 ) )

    const requestHandler = await new RequestHandler( endpoint, searchParams );
    const { error, result } = requestHandler.toJSON();

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