"use client"

import { Left, Right } from "@/components/Generics";
import type { SearchParamsType } from "@/types/searchParams";
import { DownloadIcon, ExpandIcon, LinkIcon } from "@/components/Icons";

import "@/styles/label.css"

type PropsType = {
    searchParams: SearchParamsType
}

export default function ListLabel( { searchParams }: PropsType ) {

    console.log( "rendering: ListLabel..." )

    return (
        <div className="Label ListLabel">
            <Left>
                Λίστα δεδομένων
            </Left>
            <Right>
                <ExpandIcon className="icon" title="Πλήρης οθόνη" />
                <DownloadIcon className="icon" title="Κατέβασμα σε αρχείο" />
                <LinkIcon className="icon" title="Σύνδεσμος λίστας" />
            </Right>
        </div>
    );
}



