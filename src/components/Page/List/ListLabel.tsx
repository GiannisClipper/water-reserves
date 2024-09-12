"use client"

import { Left, Right } from "@/components/Generics";
import { DownloadIcon, ScreenIcon, LinkIcon } from "@/components/Icons";
import { downloadList } from "@/logic/_common/download";

import "@/styles/label.css"

import type { RequestResultType } from "@/types/requestResult";

type PropsType = { result: RequestResultType | null }

const ListLabel = ( { result }: PropsType ) => {

    console.log( "rendering: ListLabel..." )

    return (
        <div className="Label ListLabel">
            <Left>
                Λίστα δεδομένων
            </Left>
            { 
            result
            ?
            <Right>
                <ScreenIcon className="icon" title="Ευρεία οθόνη" />
                <LinkIcon className="icon" title="Σύνδεσμος ευρείας οθόνης" />
                <DownloadIcon className="icon" title="Κατέβασμα σε αρχείο" onClick={ downloadList } />
            </Right>
            :
            null
            }
        </div>
    );
}

export default ListLabel;


