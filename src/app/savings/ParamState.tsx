"use client";

import { useState } from "react";
import ParamLabel from "./ParamLabel";
import ParamContent from "./ParamContent";
import type { SearchParamsType } from "@/types/searchParams";
import type { RequestErrorType } from "@/types/requestResult";

type PropsType = {
    searchParams: SearchParamsType
    reservoirs: [ { [ key: string ]: any } ] | null
    error: RequestErrorType | null
}

const ParamSection = ( { searchParams, error, reservoirs }: PropsType ) => {

    const [ onSearch, setOnSearch ] = useState<boolean>( false );

    console.log( "rendering: ParamSection..." )

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

export default ParamSection;

