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
                List
            </Left>
            <Right>
                <ScreenIcon className="icon" title="Wide view" />
                <LinkIcon className="icon" title="Wide view link" />
                <DownloadIcon className="icon" title="Download as file" onClick={ downloadList } />
            </Right>
        </div>
    );
}

export default ListLabel;


