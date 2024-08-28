import Header from "../Header";
import ParamSection from "./ParamSection";
import DataSection from "./DataSection";
import { Suspense } from "react";
import type { SearchParamsType } from "@/types/searchParams";

import "@/styles/page.css";

type PropsType = { searchParams: SearchParamsType }

export default function Page( { searchParams }: PropsType ) {

    console.log( "rendering: Page (savings)..." )

    return (
        <>
        <Header subTitle="Δεδομένα αποθεμάτων νερού" />
    
        <div className="Content">
            <ParamSection searchParams={searchParams} />
            <Suspense fallback="<p>Loading...</p>">
                <DataSection searchParams={searchParams} />
            </Suspense>
        </div>
        </>
    );
}

