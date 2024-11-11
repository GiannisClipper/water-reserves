"use client"

import { Left, Right } from "@/components/Generics";
import { DownloadIcon, ScreenIcon, LinkIcon } from "@/components/Icons";
import BrowserUrl from "@/helpers/url/BrowserUrl";
import { downloadList } from "@/logic/download";

import Modal from '@/components/Modal';

import "@/styles/label.css"
import { useState } from "react";
import { ButtonCopy } from "@/components/Button";

const ListLabel = () => {

    const [ modal, setModal ] = useState<boolean>( false );
    
    const getUrl = (): string => {
        const url: BrowserUrl = new BrowserUrl( window );
        const pathname: string = url.getPathname() + '/list';
        url.setPathname( pathname );
        return url.getUrl();
    }

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
                <LinkIcon className="icon" title="Wide view link" onClick={ () => setModal( true ) } />
                <DownloadIcon className="icon" title="Download as file" onClick={ downloadList } />
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

export default ListLabel;


