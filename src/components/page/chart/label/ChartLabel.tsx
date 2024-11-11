"use client"

import { useState } from "react";
import { Left, Right } from "@/components/Generics";
import { LinkIcon, ScreenIcon, DownloadIcon } from "@/components/Icons";
import Modal from "@/components/Modal";
import { ButtonCopy, ButtonDownload } from "@/components/Button";

import { downloadChart } from "@/logic/download";
import BrowserUrl from "@/helpers/url/BrowserUrl";
import type { ObjectType } from "@/types";
import "@/styles/label.css"

export default function ChartLabel( props: ObjectType ) {

    const { children } = props;

    const [ urlModal, setUrlModal ] = useState<boolean>( false );
    const [ downloadModal, setDownloadModal ] = useState<boolean>( false );
    const [ filename, setFilename ] = useState<string>( 'water-reserves' );
    
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
                <LinkIcon className="icon" title="Wide view link" onClick={ () => setUrlModal( true ) } />
                <DownloadIcon className="icon" title="Download as image" onClick={ () => setDownloadModal( true ) } />
            </Right>

            { urlModal
            ?
            <Modal
                className="UrlModal"
                title={ 'URL to reproduce the list (in wide view)' }
                onClose={ () => setUrlModal( false ) }
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

            { downloadModal
            ?
            <Modal
                className="DownloadModal"
                title={ 'Download as file' }
                onClose={ () => setDownloadModal( false ) }
            > 
                <div>
                    <span>Filename:</span>
                    <input
                        value={ filename }
                        onChange={ e => setFilename( e.target.value ) }
                    />
                </div>
                <ButtonDownload 
                    label="Download as PNG"
                    onClick={ () => downloadChart( filename + '.png' ) }
                />
            </Modal>
            :
            null
            }

        </div>
    );
}


