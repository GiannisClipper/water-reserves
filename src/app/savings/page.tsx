import ParamSection from "./ParamSection";
import DataSection from "./DataSection";
import { Suspense } from "react";

type propsType = {
    searchParams: {}[]
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

