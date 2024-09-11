"use client"

import { Left, Right } from "@/components/Generics";
import { DownloadIcon, ScreenIcon, LinkIcon } from "@/components/Icons";
import { downloadText } from "@/helpers/download";

import "@/styles/label.css"

import type { RequestResultType } from "@/types/requestResult";

type PropsType = { result: RequestResultType | null }

const ListLabel = ( { result }: PropsType ) => {

    const getTable = () => {
        const table: HTMLCollection = document.body.getElementsByClassName( 'ListContent' );
        const trs: HTMLCollectionOf<Element> = table[ 0 ].getElementsByTagName( 'tr' );

        let keys: Array<string | null> = [];
        const data: any[][] = [];

        const cleanRepr = ( text: string | null ) => {
            if ( text ) {
                return text.replaceAll( ',', '' ).replace( 'm3', '' ).trim();
            }
            return "";
        }

        Array.from( trs ).forEach( ( tr: any, i: number ) => {

            if ( i === 0 ) {
                const ths: HTMLCollectionOf<Element> = tr.getElementsByTagName( 'th' );
                keys = Array.from( ths ).map( th => th.getAttribute( "data-key" ) );
        
            } else {
                const tds: HTMLCollectionOf<Element> = tr.getElementsByTagName( 'td' );
                data.push( Array.from( tds ).map( td => cleanRepr ( td.textContent ) ) );
            }
        } );

        const rows: string[] = [];
        rows.push( keys.join( ',' ) );
        data.forEach( row => rows.push( row.join( ',' ) ) );

        const text = rows.join( '\n' );
        downloadText( 'savings.txt', text );

        console.log( 'keys, data', keys, data );
    }

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
                <DownloadIcon className="icon" title="Κατέβασμα σε αρχείο" onClick={ getTable } />
            </Right>
            :
            null
            }
        </div>
    );
}

export default ListLabel;


