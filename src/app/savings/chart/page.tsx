import { Suspense } from "react";
import Header from "@/app/Header";
import DataSection from "./DataSection";
import { DataSectionSkeleton } from "@/components/Wide/Skeleton";
import type { SearchParamsType } from "@/types/searchParams";
import { SAVINGS } from "@/app/settings";

type PropsType = { searchParams: SearchParamsType }

import "@/styles/header.css";
import "@/styles/wide.css";

export default function Page( { searchParams }: PropsType ) {

    console.log( "rendering: Page (savings)..." )

    return (
        <>
        <Header subTitle={SAVINGS} />

        <div className="Content">

            <Suspense fallback={ <DataSectionSkeleton /> }>
                <DataSection searchParams={searchParams} />
            </Suspense>
        </div>

        </>
    );
}
