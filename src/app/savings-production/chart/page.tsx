import { Suspense } from "react";

import Header from "@/app/Header";
import DataSection from "@/components/wide/DataSection";
import { DataSectionSkeleton } from "@/components/wide/Skeleton";

import { SAVINGS_PRODUCTION } from "@/app/settings";

import type { SearchParamsType } from "@/types/searchParams";

import "@/styles/header.css";
import "@/styles/wide.css";

const endpoint: string = 'savings-production';

type PropsType = { searchParams: SearchParamsType }

export default function Page( { searchParams }: PropsType ) {

    console.log( "rendering: Page (savings-production)..." )

    return (
        <>
        <Header subTitle={ SAVINGS_PRODUCTION } />

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
