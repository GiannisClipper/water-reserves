class BrowserUrl {

    window: Window | undefined;
    origin: string = '';
    pathname: string = '';
    params: string[] = [];

    constructor( window: any ) {
        this.window = window;
        this.origin = window.location.origin;
        this.pathname = window.location.pathname;

        // example of window.location.search -> ?par1=something&par2=else&par3=99
        this.params = window.location.search.split( '&' );
        if ( this.params.length ) {
            // to remove the leading ? from query parameters
            this.params[ 0 ] = this.params[ 0 ].slice( 1 );
        }
    }

    getPathname(): string {
        return this.pathname;
    }

    setPathname( pathname: string ): BrowserUrl {
        this.pathname = pathname;
        return this;
    }

    getParams(): string[] {
        return this.params;
    }

    setParams( params: string[] ): BrowserUrl {
        this.params = params;
        return this;
    }

    getParam( key: string ): string | undefined {

        const found: string[] = this.params.filter( p => p.startsWith( `${key}=` ) );
        if ( found.length ) {
            const [ key, value ] = found[ 0 ].split( '=' );
            return value;
        }
        return undefined;
    }

    setParam( key: string, value: any ): BrowserUrl {

        // replace param if exists
        this.params = this.params.map( 
            p => p.startsWith( `${key}=` ) ? `${key}=${value}` : p 
        );

        // add param if not exists
        if ( ! this.params.filter( p => p.startsWith( `${key}=` ) ).length ) {
            this.params.push( `${key}=${value}` );
        }

        return this;
    }

    updateQueryString(): void {

        // update query string on browser url
        if ( this.window ) {
            this.window.history.replaceState( {} , '', `${this.pathname}?${this.params.join( '&' )}` );
        }
    }

    getUrl(): string { // compose the url string

        return `${this.origin}${this.pathname}?${this.params.join( '&' )}`;
    }

    open(): void { // open in current tab

        if ( this.window ) {
            // this.window.location.href = this.getUrl(); 
            this.window.open( this.getUrl(), '_self' );
        }
    }

    openBlank(): void { // open in new tab

        if ( this.window ) {
            this.window.open( this.getUrl(), '_blank' );
        }
    }
}

export default BrowserUrl;
