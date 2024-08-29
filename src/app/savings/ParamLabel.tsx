"use client"

import { Left, Right } from "@/components/Generics";
import type { SearchParamsType } from "@/types/searchParams";
import { WriteIcon, SearchIcon, LinkIcon } from "@/components/Icons";

import "@/styles/label.css"

type PropsType = { 
    searchParams: SearchParamsType
    setOnSearch: CallableFunction 
}

export default function ParamLabel( { searchParams, setOnSearch }: PropsType ) {

    console.log( "rendering: ParamLabel..." )

    return (
        <div className="Label ParamLabel">
            <Left>
                Παράμετροι
            </Left>
            <Right>
                {/* <WriteIcon className="icon" title="Ορισμός παραμέτρων" /> */}
                <SearchIcon onClick={ () => setOnSearch( true ) } className="icon" title="Αναζήτηση δεδομένων" />
                { 
                Object.keys( searchParams ).length > 0
                ?
                <LinkIcon className="icon" title="Σύνδεσμος σελίδας" />
                :
                null
                }
            </Right>
        </div>
    );
}
