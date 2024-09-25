"use client"

import { Left, Right } from "@/components/Generics";
import { DownloadIcon, ScreenIcon, LinkIcon } from "@/components/Icons";
import { downloadList } from "@/logic/download";

import "@/styles/label.css"

const ListLabel = () => {

    console.log( "rendering: ListLabel..." )

    return (
        <div className="Label ListLabel">
            <Left>
                Λίστα δεδομένων
            </Left>
            <Right>
                <ScreenIcon className="icon" title="Ευρεία οθόνη" />
                <LinkIcon className="icon" title="Σύνδεσμος ευρείας οθόνης" />
                <DownloadIcon className="icon" title="Κατέβασμα σε αρχείο" onClick={ downloadList } />
            </Right>
        </div>
    );
}

export default ListLabel;


