import { Suspense } from "react";

import Header from "@/app/Header";
import { DataSectionSkeleton } from "@/components/wide/Skeleton";
import type { SearchParamsType } from "@/types/searchParams";

import "@/styles/header.css";
import "@/styles/wide.css";

type PropsType = { 
    subTitle: string
    DataSection: any
    endpoint: string
    searchParams: SearchParamsType
}

export default function Page( { subTitle, DataSection, endpoint, searchParams }: PropsType ) {

    console.log( `rendering: Page (${endpoint})...` )

    return (
        <>
        <Header subTitle={ subTitle } endpoint={ endpoint } />

        <div className="Content">

            <Suspense fallback={ <DataSectionSkeleton /> }>
                <DataSection 
                    endpoint={ endpoint }
                    searchParams={searchParams} 
                />
            </Suspense>
        </div>

        </>
    );
}
