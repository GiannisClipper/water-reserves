function download( filename: string, data: string ): void {

    console.log( data )
    const elem = document.createElement( 'a' );
    elem.setAttribute( 'href', data );
    elem.setAttribute( 'download', filename );
    elem.style.display = 'none';
    document.body.appendChild( elem );
    elem.click();  
    document.body.removeChild( elem );
}

function downloadText( filename: string, text: string ): void {
    const data: string = 'data:text/plain;charset=utf-8,' + encodeURIComponent( text ); 
    download( filename, data );
}

function downloadImage( filename: string, data: string ): void {
    download( filename, data );
}

export { downloadText, downloadImage };