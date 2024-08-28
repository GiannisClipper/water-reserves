import Header from "../Header";
import ParamSection from "./ParamSection";
import DataSection from "./DataSection";
import { Suspense } from "react";
import type { SearchParamsType } from "@/types/searchParams";

type PropsType = { searchParams: SearchParamsType }

export default function Savings( { searchParams }: PropsType ) {

    console.log( "rendering: Savings (page)..." )

    return (
        <>
        <Header subTitle="Δεδομένα αποθεμάτων νερού" />
    
        <div className="page-sections">
            <ParamSection searchParams={searchParams} />
            <Suspense fallback="<p>Loading...</p>">
                <DataSection searchParams={searchParams} />
            </Suspense>
        </div>
        </>
    );
}

