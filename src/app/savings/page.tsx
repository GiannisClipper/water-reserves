import ParamSection from "./ParamSection";
import DataSection from "./DataSection";
import { Suspense } from "react";

type searchParamsType = {
    time_range?: string
}

type propsType = {
    searchParams: searchParamsType
}

export default function Savings( { searchParams }: propsType ) {

    console.log( "rendering: Savings (page)..." )

    return (
        <>
        <div className="page-title">
            Savings page
        </div>
        <div className="page-sections">
            <ParamSection searchParams={searchParams} />
            <Suspense fallback="<p>Loading...</p>">
                <DataSection searchParams={searchParams} />
            </Suspense>
        </div>
        </>
);
}

