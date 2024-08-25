import { Suspense } from "react";
import ChartSection from "./ChartSection";
import ListSection from "./ListSection";
import type { SearchParamsType } from "@/types/searchParams";
import type { RequestResultType } from "@/types/requestResult";
import { SavingsRequest } from "@/helpers/Requests";

type PropsType = { searchParams: SearchParamsType }

const DataSection = async ( { searchParams }: PropsType ) => {

    let result: RequestResultType | null = null;

    const savingsRequest = new SavingsRequest( searchParams );

    if ( savingsRequest.getQueryParams().time_range ) {
        console.log( savingsRequest.url );
        const response = await fetch( savingsRequest.url );
        result = await response.json();
    }

    console.log( "rendering: DataSection..." )

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