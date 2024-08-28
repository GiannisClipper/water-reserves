import { NEXT_PUBLIC_SELF_BASE_URL } from '@/app/settings';

import type { 
    SearchParamsType,
    SavingsSearchParamsType,
} from "@/types/searchParams";

abstract class SelfRequest {

    // public searchParams: SearchParamsType;
    
    // constructor( searchParams: SearchParamsType ) {
    //     this.searchParams = searchParams;
    // }

    // public get urlParams(): string {
    //     return Object.entries( this.searchParams )
    //         .filter( entry => entry[ 1 ] )
    //         .map( entry => `${entry[ 0 ]}=${entry[ 1 ]}` ).join( '&' );
    // }

    // abstract get url(): string;

    constructor() {};

    protected static urlParams( params: { [ key: string ]: any } ): string {
        return Object
            .entries( params )
            .map( entry => `${entry[ 0 ]}=${entry[ 1 ]}` ).join( '&' );
    }

    abstract get url(): string;
}

class SavingsSelfRequest extends SelfRequest { 

    public endpoint: string = 'savings';
    
    public searchParams: SavingsSearchParamsType;
    
    constructor( searchParams: SavingsSearchParamsType ) {
        super();
        this.searchParams = searchParams;
    }

    public get urlParams(): string {
        return SelfRequest.urlParams( this.searchParams );
    }

    public get url(): string {
        return `${NEXT_PUBLIC_SELF_BASE_URL}/${this.endpoint}?${this.urlParams}`;
    }
}

export { 
    SavingsSelfRequest 
};