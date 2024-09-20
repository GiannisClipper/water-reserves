import type { ObjectType } from "@/types";

class BrowserParams {

    window: Window | undefined;
    params: string[] = [];

    constructor( window: any ) {
        this.window = window;
        this.params = window.location.search.split( '&' );
    }

    getParam( key: string ): string | undefined {

        if ( this.params.filter( p => p.startsWith( `${key}=` ) ).length ) {
            return this.params[ 0 ];
        }
        return undefined;
    }

    setParam( key: string, value: any ): BrowserParams {

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

    update(): void {

        // update url on browser
        if ( this.window ) {
            this.window.history.replaceState( {} , '', this.params.join( '&' ) );
        }
    }

}

export default BrowserParams;
