import { Suspense } from "react";
import Header from "../Header";
import ParamSection from "./ParamSection";
import DataSection from "./DataSection";
import { DataSectionSkeleton } from "@/components/Skeletons";
import type { SearchParamsType } from "@/types/searchParams";
import { SAVINGS_RESERVOIR } from "../settings";

type PropsType = { searchParams: SearchParamsType }

import "@/styles/header.css";

export default function Page( { searchParams }: PropsType ) {

    console.log( "rendering: Page (savings-reservoir)..." )

    return (
        <>
        <Header subTitle={SAVINGS_RESERVOIR} />

        <div className="Content">

            <Suspense fallback="<p>Loading...</p>">
                <ParamSection searchParams={searchParams} />
            </Suspense>

            <Suspense fallback={ <DataSectionSkeleton /> }>
                <DataSection searchParams={searchParams} />
            </Suspense>
        </div>

        </>
    );
}
