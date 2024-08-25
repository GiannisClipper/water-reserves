import ParamSection from "./ParamSection";
import DataSection from "./DataSection";
import { Suspense } from "react";
import type { SearchParamsType } from "@/types/searchParams";

type PropsType = { searchParams: SearchParamsType }

export default function Savings( { searchParams }: PropsType ) {

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

