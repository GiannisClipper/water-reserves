import { NEXT_PUBLIC_REST_API_BASE_URL } from '@/app/settings';
import { RequestErrorType, RequestResultType } from '@/types/requestResult';

import type { 
    SearchParamsType,
    SavingsSearchParamsType,
    SavingsReservoirSearchParamsType,
} from "@/types/searchParams";

abstract class ApiRequest {    

    abstract endpoint: string;

    constructor() {};

    public get url(): string {
        return `${NEXT_PUBLIC_REST_API_BASE_URL}/${this.endpoint}`;
    }

    public async request(): Promise<[ RequestErrorType | null, any | null ]> {

        // console.log( this.url );
        const response = await fetch( this.url );
        // console.log( response.status, response.statusText )
        const result: any = await response.json();
        // console.log( result )

        if ( response.status !== 200 ) {
            const error: RequestErrorType = {
                statusCode: response.status,
                statusText: response.statusText,
                message: result.detail
            }
            return [ error, null ];
        }

        return [ null, result ];
    }
}

abstract class ApiRequestWithParams extends ApiRequest {    

    abstract searchParams: { [ key: string ]: any };

    constructor() {
        super();
    };

    get urlParams(): string {
        return Object
            .entries( this.searchParams )
            .map( entry => `${entry[ 0 ]}=${entry[ 1 ]}` ).join( '&' );
    }

    public get url(): string {
        return `${NEXT_PUBLIC_REST_API_BASE_URL}/${this.endpoint}?${this.urlParams}`;
    }
}

class ReservoirsApiRequest extends ApiRequest { 
        
    endpoint = 'reservoirs';

    constructor() { super(); }
}

class SavingsApiRequest extends ApiRequestWithParams { 
    
    endpoint = 'savings';
    searchParams = {};

    constructor( searchParams: SavingsReservoirSearchParamsType ) {
        super();
        this.searchParams = searchParams;
    }
}

export { 
    ReservoirsApiRequest,
    SavingsApiRequest, 
};