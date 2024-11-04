import { NEXT_PUBLIC_REST_API_BASE_URL } from '@/app/settings';
import ObjectList from '@/helpers/objects/ObjectList';
import { ParamValidation } from "@/logic/ParamValidation";

import type { ObjectType } from '@/types';
import type { RequestErrorType, RequestResultType } from '@/types/requestResult';
import type { SearchParamsType } from "@/types/searchParams";

abstract class RequestMaker {    

    abstract endpoint: string;
    _error: RequestErrorType | null = null;
    _result: RequestResultType | null = null;

    constructor() {};

    public get url(): string {
        return `${NEXT_PUBLIC_REST_API_BASE_URL}/${this.endpoint}`;
    }

    public async request() { // Promise<[ RequestErrorType | null, RequestResultType | null ]> {

        console.log( this.url );

        try {
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

        } catch ( error: any ) {
            // for example => TypeError: fetch failed
            // when server is not running 
            this._error = {
                message: error
            }
        }
    
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

abstract class RequestMakerWithParams extends RequestMaker {    

    searchParams: ObjectType;

    constructor( searchParams: SearchParamsType ) {
        super();
        // console.log( 'searchParams', searchParams)

        const filtered: ObjectType = {};
        Object.keys( searchParams ).map( ( key: string ) => {

            // keep these params as is
            if ( [ 'time_range', 'interval_filter', 'year_start' ].includes( key ) ) {
                filtered[ key ] = searchParams[ key ];

            // keep the leading two parts (following parts may be used by the client) 
            } else if (  [ 'time_aggregation' ].includes( key ) ) {
                if ( searchParams[ key ] ) {
                    filtered[ key ] = searchParams[ key ].split( ',' ).slice( 0, 2 ).join( ',' );
                }
            }
        } );

        this.searchParams = filtered;
        // console.log( 'searchParams (filtered)', this.searchParams )
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

class StatusRequestMaker extends RequestMaker { 
        
    endpoint = 'status';

    constructor() { super(); }
}

class ReservoirsRequestMaker extends RequestMaker { 
        
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

class FactoriesRequestMaker extends RequestMaker { 
        
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

class LocationsRequestMaker extends RequestMaker { 
        
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

class MunicipalitiesRequestMaker extends RequestMaker { 
        
    endpoint = 'municipalities';

    constructor() { super(); }

    public async request() {
        await super.request();
        if ( this._result ) {
            this._result = new ObjectList( this._result as ObjectType[] ).sortBy( 'id', 'asc' );
        }
        return this;
    }
}

class SavingsRequestMaker extends RequestMakerWithParams { 
    
    endpoint = 'savings';

    constructor( searchParams: SearchParamsType ) {
        super( searchParams );
        console.log( 'searchParams', searchParams)
        const filtered: ObjectType = this.searchParams;
        Object.keys( searchParams ).map( ( key: string ) => {
            if ( [ 'reservoir_filter', 'reservoir_aggregation' ].includes( key ) ) {
                filtered[ key ] = searchParams[ key ];
            }
        } );
        this.searchParams = filtered;
        console.log( 'searchParams (filtered)', this.searchParams )
    }
}

class ProductionRequestMaker extends RequestMakerWithParams { 
    
    endpoint = 'production';

    constructor( searchParams: SearchParamsType ) {
        super( searchParams );
        console.log( 'searchParams', searchParams)
        const filtered: ObjectType = this.searchParams;
        Object.keys( searchParams ).map( ( key: string ) => {
            if ( [ 'factory_filter', 'factory_aggregation' ].includes( key ) ) {
                filtered[ key ] = searchParams[ key ];
            }
        } );
        this.searchParams = filtered;
        console.log( 'searchParams (filtered)', this.searchParams )
    }
}

class WeatherRequestMaker extends RequestMakerWithParams { 
    
    endpoint = 'weather';

    constructor( searchParams: SearchParamsType ) {
        super( searchParams );
        console.log( 'searchParams', searchParams)
        const filtered: ObjectType = this.searchParams;
        Object.keys( searchParams ).map( ( key: string ) => {
            if ( [ 'location_filter', 'location_aggregation' ].includes( key ) ) {
                filtered[ key ] = searchParams[ key ];
            }
        } );
        this.searchParams = filtered;
        console.log( 'searchParams (filtered)', this.searchParams )
    }
}

class InterruptionsRequestMaker extends RequestMakerWithParams { 
    
    endpoint = 'interruptions';

    constructor( searchParams: SearchParamsType ) {
        super( searchParams );
        console.log( 'searchParams', searchParams)
        const filtered: ObjectType = this.searchParams;
        Object.keys( searchParams ).map( ( key: string ) => {
            if ( [ 'municipality_filter', 'municipality_aggregation' ].includes( key ) ) {
                filtered[ key ] = searchParams[ key ];
            }
        } );
        this.searchParams = filtered;
        console.log( 'searchParams (filtered)', this.searchParams )
    }
}

export { 
    RequestMaker, 
    RequestMakerWithParams,

    StatusRequestMaker,
    ReservoirsRequestMaker,
    FactoriesRequestMaker,
    LocationsRequestMaker,
    SavingsRequestMaker, 
    ProductionRequestMaker,
    WeatherRequestMaker,
    MunicipalitiesRequestMaker,
    InterruptionsRequestMaker,
};