import { Suspense } from "react";

import type { SavingsSearchParamsType } from "@/types/searchParams";
import { SavingsApiRequest } from "@/helpers/requests/ApiRequests";
import { RequestErrorType, RequestResultType } from '@/types/requestResult';

import { ChartSectionSkeleton, ListSectionSkeleton } from "@/components/Skeletons";
import Error from "./Error";
import ChartSection from "./ChartSection";
import ListSection from "./ListSection";

type PropsType = { searchParams: SavingsSearchParamsType }

const DataSection = async ( { searchParams }: PropsType ) => {

    await new Promise( resolve => setTimeout( resolve, 3000 ) )

    type Props = [ RequestErrorType | null, RequestResultType | null ];

    let [ error, result ]: Props = [ null, null ];

    if ( Object.keys( searchParams ).length > 0 ) {

        if ( ! searchParams.time_range ) {
            error = {
                message: "Δεν έχει οριστεί χρονική περίοδος δεδομένων."
            }

        } else {
            const savingsApiRequest = new SavingsApiRequest( searchParams );
            [ error, result ] = await savingsApiRequest.request();
        }
    }

    console.log( "rendering: DataSection..." )

    return (
        <div className="DataSection">

            { error ? <Error error={error} /> : null }

            <ChartSection 
                searchParams={searchParams}
                result={result} 
            />

            <Suspense fallback={<ListSectionSkeleton />}>
                <ListSection result={result} />
            </Suspense>

        </div>
    );
}

export default DataSection;