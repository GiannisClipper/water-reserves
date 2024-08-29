"use client";

import { useState } from "react";
import ParamLabel from "./ParamLabel";
import ParamContent from "./ParamContent";
import type { SearchParamsType } from "@/types/searchParams";

type PropsType = {
    searchParams: SearchParamsType
}

const ParamSection = ( { searchParams }: PropsType ) => {

    const [ onSearch, setOnSearch ] = useState<boolean>( false );

    console.log( "rendering: ParamSection..." )

    return (
        <div className="ParamSection">
            <ParamLabel 
                searchParams={ searchParams } 
                setOnSearch={ setOnSearch }
            />
            <ParamContent 
                searchParams={ searchParams } 
                onSearch={ onSearch }
            />
        </div>
    );
}

export default ParamSection;

