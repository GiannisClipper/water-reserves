"use client"

import { Left, Right } from "@/components/Generics";
import type { SearchParamsType } from "@/types/searchParams";
import { DownloadIcon, ExpandIcon, LinkIcon } from "@/components/Icons";

import "@/styles/label.css"

type PropsType = {
    searchParams: SearchParamsType
}

export default function ListLabel( { searchParams }: PropsType ) {

    const getTable = () => {
        const table: HTMLCollection = document.body.getElementsByClassName( 'ListContent' );
        const trs: HTMLCollectionOf<Element> = table[ 0 ].getElementsByTagName( 'tr' );
        const tds: HTMLCollectionOf<Element> = trs[ 1 ].getElementsByTagName( 'td' );
        console.log( 'tds[0]', tds[ 0 ].innerHTML );
        console.log( 'tds[1]', tds[ 1 ].innerHTML );
    }

    console.log( "rendering: ListLabel..." )

    return (
        <div className="Label ListLabel">
            <Left>
                Λίστα δεδομένων
            </Left>
            <Right>
                <ExpandIcon className="icon" title="Πλήρης οθόνη" />
                <DownloadIcon className="icon" title="Κατέβασμα σε αρχείο" onClick={ getTable } />
                <LinkIcon className="icon" title="Σύνδεσμος λίστας" />
            </Right>
        </div>
    );
}



