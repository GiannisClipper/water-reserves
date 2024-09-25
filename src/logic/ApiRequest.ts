import { NEXT_PUBLIC_REST_API_BASE_URL } from '@/app/settings';
import { RequestErrorType } from '@/types/requestResult';

import type { 
    SearchParamsType,
    SavingsSearchParamsType,
    ProductionSearchParamsType,
    WeatherSearchParamsType,
} from "@/types/searchParams";

abstract class ApiRequest {    

    abstract endpoint: string;

    constructor() {};

    public get url(): string {
        return `${NEXT_PUBLIC_REST_API_BASE_URL}/${this.endpoint}`;
    }

    public async request(): Promise<[ RequestErrorType | null, any | null ]> {

        console.log( this.url );
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

class FactoriesApiRequest extends ApiRequest { 
        
    endpoint = 'factories';

    constructor() { super(); }
}

class LocationsApiRequest extends ApiRequest { 
        
    endpoint = 'locations';

    constructor() { super(); }
}

class SavingsApiRequest extends ApiRequestWithParams { 
    
    endpoint = 'savings';
    searchParams = {};

    constructor( searchParams: SavingsSearchParamsType ) {
        super();
        this.searchParams = searchParams;
    }
}

class ProductionApiRequest extends ApiRequestWithParams { 
    
    endpoint = 'production';
    searchParams = {};

    constructor( searchParams: ProductionSearchParamsType ) {
        super();
        this.searchParams = searchParams;
    }
}

class WeatherApiRequest extends ApiRequestWithParams { 
    
    endpoint = 'weather';
    searchParams = {};

    constructor( searchParams: WeatherSearchParamsType ) {
        super();
        this.searchParams = searchParams;
    }
}

class ApiRequestFactory {

    private _apiRequest: ApiRequest;

    constructor( endpoint: string, searchParams?: SearchParamsType ) {

        switch ( endpoint ) {

            case 'reservoirs': {
                this._apiRequest = new ReservoirsApiRequest();
                break;
            }
            case 'factories': {
                this._apiRequest = new FactoriesApiRequest();
                break;
            }
            case 'locations': {
                this._apiRequest = new LocationsApiRequest();
                break;
            }
            case 'savings': {
                this._apiRequest = new SavingsApiRequest( searchParams || {} );
                break;
            }
            case 'production': {
                this._apiRequest = new ProductionApiRequest( searchParams || {} );
                break;
            }
            case 'precipitation': {
                this._apiRequest = new WeatherApiRequest( searchParams || {} );
                break;
            }
            default:
                throw `Invalid endpoint (${endpoint}) used in ApiRequestFactory`;
        }
    }

    get apiRequest(): ApiRequest {
        return this._apiRequest;
    }
}

export { 
    ReservoirsApiRequest,
    FactoriesApiRequest,
    LocationsApiRequest,
    SavingsApiRequest, 
    ProductionApiRequest,
    WeatherApiRequest,
    ApiRequestFactory
};