"use client"

import { useState } from "react";

import ParamLabel from "@/components/page/param/ParamLabel";
import ParamContent from "@/components/page/param/ParamContent";

import type { SavingsSearchParamsType } from "@/types/searchParams";
import type { RequestErrorType } from "@/types/requestResult";

type PropsType = {
    endpoint: string
    searchParams: SavingsSearchParamsType
    items: [ { [ key: string ]: any } ]
    error: RequestErrorType | null
}

const ParamState = ( { endpoint, searchParams, error, items }: PropsType ) => {

    const [ onSearch, setOnSearch ] = useState<boolean>( false );

    console.log( "rendering: ParamState..." )

    return (
        <div className="ParamState">
            <ParamLabel 
                searchParams={ searchParams } 
                setOnSearch={ setOnSearch }
            />
            <ParamContent
                endpoint={ endpoint }
                searchParams={ searchParams }
                items={ items }
                error={ error }
                onSearch={ onSearch }
            />
        </div>
    );
}

export default ParamState;

