import { NEXT_PUBLIC_REST_API_BASE_URL } from '@/app/settings';
import ObjectList from '@/helpers/objects/ObjectList';
import { ParamValidation } from "@/logic/ParamValidation";

import type { ObjectType } from '@/types';
import { RequestErrorType, RequestResultType } from '@/types/requestResult';

import type { 
    SearchParamsType,
    SavingsSearchParamsType,
    ProductionSearchParamsType,
    WeatherSearchParamsType,
} from "@/types/searchParams";

abstract class ApiRequest {    

    abstract endpoint: string;
    _error: RequestErrorType | null = null;
    _result: RequestResultType | null = null;

    constructor() {};

    public get url(): string {
        return `${NEXT_PUBLIC_REST_API_BASE_URL}/${this.endpoint}`;
    }

    public async request() { // Promise<[ RequestErrorType | null, RequestResultType | null ]> {

        console.log( this.url );
        const response = await fetch( this.url );
        // console.log( response.status, response.statusText )
        const result: any = await response.json();

        if ( response.status !== 200 ) {
            this._error = {
                statusCode: response.status,
                statusText: response.statusText,
                message: result.detail
            }
            return this;
        }

        this._result = result;
        return this;
    }

    get error(): RequestErrorType | null {
        return this._error;
    } 

    get result(): RequestResultType | null {
        return this._result;
    }

    toJSON(): ObjectType {
        return {
            url: this.url,
            error: this._error,
            result: this._result,
        }
    }
}

abstract class ApiRequestWithParams extends ApiRequest {    

    searchParams: ObjectType;

    constructor( searchParams: SearchParamsType ) {
        super();
        this.searchParams = searchParams;
    }

    private get urlParams(): string {
        return Object
            .entries( this.searchParams )
            .map( entry => `${entry[ 0 ]}=${entry[ 1 ]}` ).join( '&' );
    }

    public get url(): string {
        return `${NEXT_PUBLIC_REST_API_BASE_URL}/${this.endpoint}?${this.urlParams}`;
    }

    public async request() {

        this._error = new ParamValidation( this.searchParams ).validate();

        if ( ! this._error ) {
            return await super.request();
        }
        return this;
    }
}

class ReservoirsApiRequest extends ApiRequest { 
        
    endpoint = 'reservoirs';

    constructor() { super(); }

    public async request() {
        await super.request();
        if ( this._result ) {
            this._result = new ObjectList( this._result as ObjectType[] ).sortBy( 'start', 'asc' );
        }
        return this;
    }
}

class FactoriesApiRequest extends ApiRequest { 
        
    endpoint = 'factories';

    constructor() { super(); }

    public async request() {
        await super.request();
        if ( this._result ) {
            this._result = new ObjectList( this._result as ObjectType[] ).sortBy( 'start', 'asc' );
        }
        return this;
    }
}

class LocationsApiRequest extends ApiRequest { 
        
    endpoint = 'locations';

    constructor() { super(); }

    public async request() {
        await super.request();
        if ( this._result ) {
            this._result = new ObjectList( this._result as ObjectType[] ).sortBy( 'id', 'asc' );
        }
        return this;
    }
}

class SavingsApiRequest extends ApiRequestWithParams { 
    
    endpoint = 'savings';

    constructor( searchParams: SavingsSearchParamsType ) {
        super( searchParams );
    }
}

class ProductionApiRequest extends ApiRequestWithParams { 
    
    endpoint = 'production';

    constructor( searchParams: ProductionSearchParamsType ) {
        super( searchParams );
    }
}

class WeatherApiRequest extends ApiRequestWithParams { 
    
    endpoint = 'weather';

    constructor( searchParams: WeatherSearchParamsType ) {
        super( searchParams );
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
    ApiRequest,
    ApiRequestWithParams,
    ReservoirsApiRequest,
    FactoriesApiRequest,
    LocationsApiRequest,
    SavingsApiRequest, 
    ProductionApiRequest,
    WeatherApiRequest,
    ApiRequestFactory
};