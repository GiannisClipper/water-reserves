import type { SavingsSearchParamsType } from "@/types/searchParams";
import { SavingsApiRequest } from "@/logic/_common/ApiRequests";
import { RequestErrorType, RequestResultType } from '@/types/requestResult';

import { ChartSectionSkeleton } from "@/components/Page/Skeleton";
import Error from "@/components/Page/Error";
import ChartSection from "./ChartSection";
import { ParamsValidation } from "@/logic/_common/ParamsValidation";

type PropsType = { searchParams: SavingsSearchParamsType }

const DataSection = async ( { searchParams }: PropsType ) => {

    // await new Promise( resolve => setTimeout( resolve, 2000 ) )

    type Props = [ RequestErrorType | null, RequestResultType | null ];

    let [ error, result ]: Props = [ null, null ];

    const blankPage: boolean = Object.keys( searchParams ).length === 0;

    if ( ! blankPage ) {

        error = new ParamsValidation( searchParams ).validate();

        if ( ! error ) {
            const apiRequest = new SavingsApiRequest( searchParams );
            [ error, result ] = await apiRequest.request();
        }
    }

    console.log( "rendering: DataSection..." );

    return ( 
        
        blankPage
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
                searchParams={searchParams}
                result={result} 
            />
        </div>
    );
}

export default DataSection;