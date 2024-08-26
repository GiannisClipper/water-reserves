import { Suspense } from "react";
import ChartSection from "./ChartSection";
import ListSection from "./ListSection";
import type { SearchParamsType } from "@/types/searchParams";
import type { RequestResultType } from "@/types/requestResult";
import { SavingsRequest } from "@/helpers/ApiRequests";

type PropsType = { searchParams: SearchParamsType }

const DataSection = async ( { searchParams }: PropsType ) => {

    let response: any = null;
    let result: RequestResultType | null = null;

    const savingsRequest = new SavingsRequest( searchParams );

    if ( savingsRequest.getRequestParams().time_range ) {
        console.log( savingsRequest.url );
        response = await fetch( savingsRequest.url );
        console.log( response.status, response.statusText )
        result = await response.json();
        console.log( result )
    }

    console.log( "rendering: DataSection..." )

    if ( response && response.status !== 200 ) {
        return (
            <div className="DataSection">
                { `${response.status}, ${response.statusText}` }
            </div>
        )
    }

    return (
        <div className="DataSection">
            <Suspense fallback="<p>Loading...</p>">
                <ChartSection result={result} />
            </Suspense>
            <Suspense fallback="<p>Loading...</p>">
                <ListSection result={result} />
            </Suspense>
        </div>
    );
}

export default DataSection;