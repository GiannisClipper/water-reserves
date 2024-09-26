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
                Παράμετροι
            </Left>
            <Right>
                <SearchIcon 
                    onClick={ () => setOnPageRequest( true ) } 
                    className="icon" 
                    title="Αναζήτηση-επεξεργασία δεδομένων" 
                />

                { Object.keys( searchParams ).length > 0
                    ?
                    <LinkIcon 
                        className="icon" 
                        title="Σύνδεσμος σελίδας" 
                    />
                    :
                    null
                }
            </Right>
        </div>
    );
}
