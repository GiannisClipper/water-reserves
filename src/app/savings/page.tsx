import Header from "../Header";
import ParamSection from "./ParamSection";
import DataSection from "./DataSection";
import { Suspense } from "react";
import type { SearchParamsType } from "@/types/searchParams";
import { SAVINGS } from "../settings";
import { ReservoirsApiRequest } from "@/helpers/requests/ApiRequests";

import "@/styles/page.css";

type PropsType = { searchParams: SearchParamsType }

export default async function Page( { searchParams }: PropsType ) {

    const reservoirsApiRequest = new ReservoirsApiRequest();

    const [ error, result ] = await reservoirsApiRequest.request();

    console.log( error, result )

    console.log( "rendering: Page (savings)..." )

    return (
        <>
        <Header subTitle={ SAVINGS } />
    
        <div className="Content">
            <ParamSection 
                searchParams={searchParams} 
            />
            <Suspense fallback="<p>Loading...</p>">
                <DataSection searchParams={searchParams} />
            </Suspense>
        </div>
        </>
    );
}

