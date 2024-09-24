import { Suspense } from "react";
import Header from "../Header";
import ParamSection from "./ParamSection";
import DataSection from "./DataSection";
import { DataSectionSkeleton } from "@/components/Page/Skeleton";
import type { SearchParamsType } from "@/types/searchParams";
import { SAVINGS } from "../settings";

import "@/styles/header.css";
import "@/styles/page.css";

const endpoint: string = 'savings';

type PropsType = { 
    searchParams: SearchParamsType 
}

export default function Page( { searchParams }: PropsType ) {

    console.log( "rendering: Page (savings)..." )

    return (
        <>
        <Header subTitle={SAVINGS} />

        <div className="Content">

            <Suspense fallback="<p>Loading...</p>">
                <ParamSection 
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
