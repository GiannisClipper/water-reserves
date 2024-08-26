import { SELF_BASE_URL } from '@/app/settings';

import type { SearchParamsType } from "@/types/searchParams";

abstract class SelfRequest {

    public searchParams: SearchParamsType;
    
    constructor( searchParams: SearchParamsType ) {
        this.searchParams = searchParams;
    }

    public get urlParams(): string {
        return Object.entries( this.searchParams )
            .filter( entry => entry[ 1 ] )
            .map( entry => `${entry[ 0 ]}=${entry[ 1 ]}` ).join( '&' );
    }

    abstract get url(): string;
}

class SavingsSelfRequest extends SelfRequest { 

    public endpoint: string = 'savings';
    
    public get url(): string {
        return `${SELF_BASE_URL}/${this.endpoint}?${this.urlParams}`;
    }
}

export { SavingsSelfRequest };