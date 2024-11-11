import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import { downloadText, downloadImage } from "@/helpers/download";

const downloadList = ( filename: string ): void => {

    filename = filename || 'filename';

    const table: HTMLCollection = document.body.getElementsByClassName( 'ListContent' );
    const trs: HTMLCollectionOf<Element> = table[ 0 ].getElementsByTagName( 'tr' );

    let keys: Array<string | null> = [];
    const data: any[][] = [];

    const cleanRepr = ( text: string | null ) => {
        if ( text ) {
            return text.replaceAll( ',', '' )
                .replace( 'm3', '' )
                .replace( 'mm', '' )
                .replace( 'oC', '' )
                .replace( 'km2', '' )
                .replace( '%', '' )
                .trim();
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
    downloadText( filename, text );
}

const downloadChart = ( filename: string ): void => {

    filename = filename || 'filename';

    const chartElem = document.body.getElementsByClassName( 'ChartContent' )[ 0 ] as HTMLElement;

    htmlToImage.toPng( chartElem ) //{ quality: 0.95 }
        .then( ( dataUrl: string ) => downloadImage( filename, dataUrl ) )
        .catch( ( error: any ) => console.error( 'Error:', error ) );
}

export { downloadList, downloadChart };