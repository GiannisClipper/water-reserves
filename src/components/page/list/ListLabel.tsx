"use client"

import { Left, Right } from "@/components/Generics";
import { DownloadIcon, ScreenIcon, LinkIcon } from "@/components/Icons";
import BrowserUrl from "@/helpers/url/BrowserUrl";
import { downloadList } from "@/logic/download";

import Modal from '@/components/Modal';

import "@/styles/label.css"
import { useState } from "react";
import { ButtonCopy, ButtonDownload } from "@/components/Button";
import { FieldFilename } from "@/components/Field";

const ListLabel = () => {

    const [ urlModal, setUrlModal ] = useState<boolean>( false );
    const [ downloadModal, setDownloadModal ] = useState<boolean>( false );
    const [ filename, setFilename ] = useState<string>( 'water-reserves' );

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
                <LinkIcon className="icon" title="Wide view link" onClick={ () => setUrlModal( true ) } />
                <DownloadIcon className="icon" title="Download as file" onClick={ () => setDownloadModal( true ) } />
            </Right>

            { urlModal
            ?
            <Modal
                className="UrlModal"
                title={ 'URL to reproduce the list (in wide view)' }
                onClose={ () => setUrlModal( false ) }
            > 
                <div>{ getUrl() }</div>
                <ButtonCopy onClick={ () => navigator.clipboard.writeText( getUrl() )} />
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
                    label="Download as CSV"
                    onClick={ () => downloadList( filename + '.csv' ) }
                />
                <ButtonDownload 
                    label="Download as JSON"
                    onClick={ () => downloadList( filename + '.json' ) }
                />
            </Modal>
            :
            null
            }

        </div>
    );
}

export default ListLabel;


