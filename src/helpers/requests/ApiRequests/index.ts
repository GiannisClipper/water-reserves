import { NEXT_PUBLIC_REST_API_BASE_URL } from '@/app/settings';
import { RequestErrorType, RequestResultType } from '@/types/requestResult';

import type { 
    SearchParamsType,
    SavingsSearchParamsType,
} from "@/types/searchParams";

abstract class ApiRequest {    

    abstract endpoint: string;

    searchParams: { [ key: string ]: any } = {};

    constructor() {};

    get urlParams(): string {
        return Object
            .entries( this.searchParams )
            .map( entry => `${entry[ 0 ]}=${entry[ 1 ]}` ).join( '&' );
    }

    public get url(): string {
        return `${NEXT_PUBLIC_REST_API_BASE_URL}/${this.endpoint}?${this.urlParams}`;
    }

    public async request(): Promise<[ RequestErrorType | null, RequestResultType | null ]> {

        if ( ! this.searchParams.time_range ) {
            const error: RequestErrorType = {
                message: "Time range not defined."
            }
            return [ error, null ];
        }

        console.log( this.url );
        const response = await fetch( this.url );
        console.log( response.status, response.statusText )
        const result: any = await response.json();
        console.log( result )

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

class SavingsApiRequest extends ApiRequest { 
        
    endpoint = 'savings';

    constructor( searchParams: SavingsSearchParamsType ) {
        super();
        this.searchParams = searchParams;
    }
}

export { 
    SavingsApiRequest, 
};