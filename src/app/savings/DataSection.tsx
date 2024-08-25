import { Suspense } from "react";
import ChartSection from "./ChartSection";
import ListSection from "./ListSection";
import type { SearchParamsType } from "@/types/searchParams";
import type { SavingsQueryParamsType } from "@/types/queryParams";
import type { RequestResultType } from "@/types/requestResult";
import { parseSavingsQueryParams } from "@/helpers/params";
import { REST_API_BASE_URL } from '../settings';

type PropsType = { searchParams: SearchParamsType }

const DataSection = async ( { searchParams }: PropsType ) => {

    let result: RequestResultType | null = null;

    const queryParams: SavingsQueryParamsType = parseSavingsQueryParams( searchParams );

    if ( queryParams.time_range ) {
        const queryParamsString: string = Object.entries( queryParams ).map( entry => `${entry[ 0 ]}=${entry[ 1 ]}` ).join( '&' );
        const url: string = `${REST_API_BASE_URL}/savings?${queryParamsString}`;
        console.log( url );
        const response = await fetch( url );
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