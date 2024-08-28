"use client"

import { Left, Right } from "@/components/Generics";
import type { SearchParamsType } from "@/types/searchParams";
import { WriteIcon, LinkIcon } from "@/components/Icons";

import "@/styles/label.css"

type PropsType = {
    searchParams: SearchParamsType
}

export default function ParamLabel( { searchParams }: PropsType ) {

    console.log( "rendering: ParamLabel..." )

    return (
        <div className="Label ParamLabel">
            <Left>
                Παράμετροι
            </Left>
            <Right>
                <WriteIcon onClick={()=>alert('hi')} className="icon" title="Ορισμός παραμέτρων" />
                <LinkIcon className="icon" title="Σύνδεσμος σελίδας" />
            </Right>
        </div>
    );
}
