"use client"

import { Left, Right } from "@/components/Generics";
import { DownloadIcon, ScreenIcon, LinkIcon } from "@/components/Icons";
import BrowserUrl from "@/helpers/url/BrowserUrl";
import { downloadList } from "@/logic/download";

import "@/styles/label.css"

const ListLabel = () => {

    const expandChart = (): void => {
        const url: BrowserUrl = new BrowserUrl( window );
        const pathname: string = url.getPathname() + '/list';
        url.setPathname( pathname );
        url.openBlank();
    }

    console.log( "rendering: ListLabel..." )

    return (
        <div className="Label ListLabel">
            <Left>
                List
            </Left>
            <Right>
                <ScreenIcon className="icon" title="Wide view" onClick={ expandChart } />
                <LinkIcon className="icon" title="Wide view link" />
                <DownloadIcon className="icon" title="Download as file" onClick={ downloadList } />
            </Right>
        </div>
    );
}

export default ListLabel;


