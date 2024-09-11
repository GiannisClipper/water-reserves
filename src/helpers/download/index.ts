function downloadText( filename: string, text: string ) {

    const elem = document.createElement( 'a' );
    elem.setAttribute( 'href', 'data:text/plain;charset=utf-8,' + encodeURIComponent( text ) );
    elem.setAttribute( 'download', filename );
    elem.style.display = 'none';
    document.body.appendChild(elem);
    elem.click();  
    document.body.removeChild(elem);
}

export { downloadText };