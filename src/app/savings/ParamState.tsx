"use client"

import { useState } from "react";
import ParamLabel from "@/components/page/param/ParamLabel";
import ParamContent from "./ParamContent";
import type { SavingsSearchParamsType } from "@/types/searchParams";
import type { RequestErrorType } from "@/types/requestResult";

type PropsType = {
    searchParams: SavingsSearchParamsType
    reservoirs: [ { [ key: string ]: any } ] | null
    error: RequestErrorType | null
}

const ParamState = ( { searchParams, error, reservoirs }: PropsType ) => {

    const [ onSearch, setOnSearch ] = useState<boolean>( false );

    console.log( "rendering: ParamState..." )

    return (
        <div className="ParamState">
            <ParamLabel 
                searchParams={ searchParams } 
                setOnSearch={ setOnSearch }
            />
            <ParamContent 
                searchParams={ searchParams }
                onSearch={ onSearch }
                reservoirs={ reservoirs }
                error={ error }
            />
        </div>
    );
}

export default ParamState;

