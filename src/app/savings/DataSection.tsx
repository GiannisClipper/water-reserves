import { Suspense } from "react";

import type { SavingsSearchParamsType } from "@/types/searchParams";
import { SavingsApiRequest } from "@/helpers/requests/ApiRequests";
import { RequestErrorType, RequestResultType } from '@/types/requestResult';

import Error from "./Error";
import ChartSection from "./ChartSection";
import ListSection from "./ListSection";

type PropsType = { searchParams: SavingsSearchParamsType }

const DataSection = async ( { searchParams }: PropsType ) => {

    const savingsApiRequest = new SavingsApiRequest( searchParams );

    type Props = [ error: RequestErrorType | null, result: RequestResultType | null ];

    const [ error, result ]: Props = await savingsApiRequest.request();

    console.log( "rendering: DataSection..." )

    return (
        <div className="DataSection">

            { error ? <Error error={error} /> : null }

            <Suspense fallback="<p>Loading...</p>">
                <ChartSection 
                    searchParams={searchParams}
                    result={result} 
                />
            </Suspense>

            <Suspense fallback="<p>Loading...</p>">
                <ListSection result={result} />
            </Suspense>

        </div>
    );
}

export default DataSection;