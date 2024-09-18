import { NEXT_PUBLIC_SELF_BASE_URL } from '@/app/settings';

import type { 
    SearchParamsType,
    SavingsSearchParamsType,
} from "@/types/searchParams";

abstract class SelfRequest {

    abstract endpoint: string;
    abstract searchParams: SearchParamsType;

    constructor() {};

    public get urlParams(): string {
        return Object
            .entries( this.searchParams )
            .map( entry => `${entry[ 0 ]}=${entry[ 1 ]}` ).join( '&' );
    }

    public get url(): string {
        return `${NEXT_PUBLIC_SELF_BASE_URL}/${this.endpoint}?${this.urlParams}`;
    }
}

class SavingsSelfRequest extends SelfRequest { 

    public endpoint: string = 'savings';
    public searchParams: SavingsSearchParamsType;
    
    constructor( searchParams: SavingsSearchParamsType ) {
        super();
        this.searchParams = searchParams;
    }
}

export { 
    SavingsSelfRequest,
};