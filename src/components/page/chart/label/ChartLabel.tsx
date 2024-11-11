"use client"

import { useState } from "react";
import { Left, Right } from "@/components/Generics";
import { LinkIcon, ScreenIcon, DownloadIcon } from "@/components/Icons";
import Modal from "@/components/Modal";
import { ButtonCopy } from "@/components/Button";

import { downloadChart } from "@/logic/download";
import BrowserUrl from "@/helpers/url/BrowserUrl";
import type { ObjectType } from "@/types";
import "@/styles/label.css"

export default function ChartLabel( props: ObjectType ) {

    const { children } = props;

    const [ modal, setModal ] = useState<boolean>( false );
    
    const getUrl = (): string => {
        const url: BrowserUrl = new BrowserUrl( window );
        const pathname: string = url.getPathname() + '/chart';
        url.setPathname( pathname );
        return url.getUrl();
    }

    const expandChart = (): void => {
        const url: BrowserUrl = new BrowserUrl( window );
        const pathname: string = url.getPathname() + '/chart';
        url.setPathname( pathname );
        url.openBlank();
    }

    console.log( "rendering: ChartLabel..." )

    return (
        <div className="Label ChartLabel">
            <Left>
                Charts
            </Left>

            <Right>
                { children }
                <ScreenIcon className="icon" title="Wide view" onClick={ expandChart } />
                <LinkIcon className="icon" title="Wide view link" onClick={ () => setModal( true ) } />
                <DownloadIcon className="icon" title="Download as image" onClick={ downloadChart } />
            </Right>

            { modal
            ?
            <Modal
                className="UrlModal"
                title={ 'URL to reproduce the list (in wide view)' }
                onClose={ () => setModal( false ) }
            > 
                <div>{ getUrl() }</div>
                <ButtonCopy
                    label="Copy to clipboard"
                    onClick={()=> navigator.clipboard.writeText( getUrl() )}
                />
            </Modal>
            :
            null
            }
        </div>
    );
}


