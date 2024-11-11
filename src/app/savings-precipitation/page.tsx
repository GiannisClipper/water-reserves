import { Suspense } from "react";

import Header from "../Header";
import ParamSection from "@/components/page/param/ParamSection";
import DataSection from "@/components/page/DataSection";
import { DataSectionSkeleton } from "@/components/page/Skeleton";

import { SAVINGS_PRECIPITATION } from "../settings";

import type { SearchParamsType } from "@/types/searchParams";

import "@/styles/header.css";
import "@/styles/page.css";

const endpoint: string = 'savings-precipitation';

type PropsType = { 
    searchParams: SearchParamsType 
}

export default function Page( { searchParams }: PropsType ) {

    console.log( "rendering: Page (savings-precipitation)..." )

    return (
        <>
        <Header subTitle={ SAVINGS_PRECIPITATION } withOptions={ true } />

        <div className="Content">

            <Suspense fallback="<p>Loading...</p>">
                <ParamSection 
                    endpoint={ endpoint }
                    searchParams={ searchParams } 
                />
            </Suspense>

            <Suspense fallback={ <DataSectionSkeleton /> }>
                <DataSection 
                    endpoint={ endpoint }
                    searchParams={ searchParams } 
                />
            </Suspense>
        </div>

        </>
    );
}

