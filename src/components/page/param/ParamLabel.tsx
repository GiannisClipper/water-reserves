"use client"

import { useState } from "react";
import BrowserUrl from "@/helpers/url/BrowserUrl";

import { Left, Right } from "@/components/Generics";
import { RefreshIcon, SearchIcon, LinkIcon } from "@/components/Icons";

import type { SearchParamsType } from "@/types/searchParams";

import "@/styles/label.css"
import Modal from "@/components/Modal";
import { ButtonCopy } from "@/components/Button";

type PropsType = { 
    searchParams: SearchParamsType
    setOnPageRequest: CallableFunction 
}

export default function ParamLabel( { searchParams, setOnPageRequest }: PropsType ) {

    const [ modal, setModal ] = useState<boolean>( false );
    
    const getUrl = (): string => new BrowserUrl( window ).getUrl();

    console.log( "rendering: ParamLabel..." )

    return (
        <div className="Label ParamLabel">
            <Left>
                Parameters
            </Left>
            <Right>
                <SearchIcon 
                    onClick={ () => setOnPageRequest( true ) } 
                    className="icon" 
                    title="Search / process data" 
                />

                { Object.keys( searchParams ).length > 0
                    ?
                    <LinkIcon 
                        className="icon" 
                        title="Page link"
                        onClick={ () => setModal( true ) }
                    />
                    :
                    null
                }
            </Right>

            { modal
            ?
            <Modal
                className="UrlModal"
                title={ 'URL to reproduce the page' }
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
