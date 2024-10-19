"use client"

import { Left, Right } from "@/components/Generics";
import { RefreshIcon, SearchIcon, LinkIcon } from "@/components/Icons";

import type { SearchParamsType } from "@/types/searchParams";

import "@/styles/label.css"

type PropsType = { 
    searchParams: SearchParamsType
    setOnPageRequest: CallableFunction 
}

export default function ParamLabel( { searchParams, setOnPageRequest }: PropsType ) {

    console.log( "rendering: ParamLabel..." )

    return (
        <div className="Label ParamLabel">
            <Left>
                Parameters
            </Left>
            <Right>
                <SearchIcon 
                    onClick={ () => setOnPageRequest( true ) } 
                    className="icon" 
                    title="Search / process data" 
                />

                { Object.keys( searchParams ).length > 0
                    ?
                    <LinkIcon 
                        className="icon" 
                        title="Page link" 
                    />
                    :
                    null
                }
            </Right>
        </div>
    );
}
