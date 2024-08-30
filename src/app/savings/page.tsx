import { Suspense } from "react";
import Header from "../Header";
import ParamSection from "./ParamSection";
import DataSection from "./DataSection";
import { DataSectionSkeleton } from "@/components/Skeletons";
import type { SearchParamsType } from "@/types/searchParams";
import { SAVINGS } from "../settings";

import "@/styles/page.css";

type PropsType = { searchParams: SearchParamsType }

export default function Page( { searchParams }: PropsType ) {

    console.log( "rendering: Page (savings)..." )

    return (
        <>
        <Header subTitle={ SAVINGS } />
    
        <div className="Content">

            <Suspense fallback="<p>Loading...</p>">
                <ParamSection searchParams={searchParams} />
            </Suspense>

            {/* <DataSectionSkeleton /> */}
            <Suspense fallback={ <DataSectionSkeleton /> }>
                <DataSection searchParams={searchParams} />
            </Suspense>
        </div>
        </>
    );
}

