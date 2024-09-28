import { Suspense } from "react";

import Header from "../Header";
import { STATUS } from "../settings";
import DataSection from "@/components/board/DataSection";

import type { SearchParamsType } from "@/types/searchParams";

import "@/styles/header.css";
import "@/styles/board.css";

const endpoint: string = 'status';

type PropsType = { 
    searchParams: SearchParamsType 
}

export default function Board( { searchParams }: PropsType ) {

    console.log( "rendering: Page (status)..." )

    return (
        <>
        <Header subTitle={STATUS} />

        <div className="Content">

            <Suspense fallback="<p>Loading...</p>">
                <DataSection 
                    endpoint={ endpoint }
                    searchParams={ searchParams }
                />
            </Suspense>
        </div>

        </>
    );
}

