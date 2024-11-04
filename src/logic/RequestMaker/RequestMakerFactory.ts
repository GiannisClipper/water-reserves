import { 
    RequestMaker, 
    StatusRequestMaker,
    ReservoirsRequestMaker,
    FactoriesRequestMaker,
    LocationsRequestMaker,
    SavingsRequestMaker, 
    ProductionRequestMaker,
    WeatherRequestMaker,
    MunicipalitiesRequestMaker,
    InterruptionsRequestMaker,
} from '.';

import type { ObjectType } from '@/types';
import type { RequestErrorType } from '@/types/requestResult';
import type { SearchParamsType } from "@/types/searchParams";

class RequestMakerCollection {

    _requestMakers: RequestMaker[];

    constructor( requestMakers: RequestMaker[] ) {
        this._requestMakers = requestMakers;
    }

    public async request() {
        for ( const requestMaker of this._requestMakers ) {
            const { error, result } = ( await requestMaker.request() ).toJSON();
            if ( error ) {
                break;
            }
        }
        return this;
    }

    get error(): RequestErrorType | null {

        for ( const requestMaker of this._requestMakers ) {
            if ( requestMaker.error ) {
                return requestMaker.error;
            }
        }
        return null;
    } 

    get result(): ObjectType | null {

        const result: ObjectType = {};
        for ( const requestMaker of this._requestMakers ) {
            if ( requestMaker.result ) {
                result[ requestMaker.endpoint ] = requestMaker.result;
            }
        }
        return result;
    }

    public toJSON(): ObjectType {
        return {
            error: this.error,
            result: this.result,
        }
    }
}

class RequestMakerFactory {

    private _requestMakerCollection: RequestMakerCollection;

    constructor( endpoint: string, searchParams?: SearchParamsType ) {

        switch ( endpoint ) {

            case 'status': {
                this._requestMakerCollection = new RequestMakerCollection( [
                    new StatusRequestMaker(),
                ] );
                break;
            }
            case 'reservoirs': {
                this._requestMakerCollection = new RequestMakerCollection( [
                    new ReservoirsRequestMaker()
                ] );
                break;
            }
            case 'factories': {
                this._requestMakerCollection = new RequestMakerCollection( [
                    new FactoriesRequestMaker()
                ] );
                break;
            }
            case 'locations': {
                this._requestMakerCollection = new RequestMakerCollection( [
                    new LocationsRequestMaker()
                ] );
                break;
            }
            case 'municipalities': {
                this._requestMakerCollection = new RequestMakerCollection( [
                    new MunicipalitiesRequestMaker()
                ] );
                break;
            }
            case 'savings': {
                this._requestMakerCollection = new RequestMakerCollection( [
                    new SavingsRequestMaker( searchParams || {} )
                ] );
                break;
            }
            case 'production': {
                this._requestMakerCollection = new RequestMakerCollection( [
                    new ProductionRequestMaker( searchParams || {} )
                ] );
                break;
            }
            case 'precipitation': {
                this._requestMakerCollection = new RequestMakerCollection( [
                    new WeatherRequestMaker( searchParams || {} )
                ] );
                break;
            }
            case 'temperature': {
                this._requestMakerCollection = new RequestMakerCollection( [
                    new WeatherRequestMaker( searchParams || {} )
                ] );
                break;
            }
            case 'interruptions': {
                this._requestMakerCollection = new RequestMakerCollection( [
                    new InterruptionsRequestMaker( searchParams || {} )
                ] );
                break;
            }
            case 'savings-production': {

                let { time_aggregation } = searchParams || {}; 
                if ( time_aggregation ) {
                    time_aggregation = time_aggregation.split( ',' )[ 0 ] + ',sum';
                }

                const searchParams1 = { ...searchParams, reservoir_aggregation: 'sum' };
                const searchParams2 = { ...searchParams, factory_aggregation: 'sum', time_aggregation };

                this._requestMakerCollection = new RequestMakerCollection( [
                    new SavingsRequestMaker( searchParams1 ),
                    new ProductionRequestMaker( searchParams2 )
                ] );
                break;
            }
            case 'savings-precipitation': {

                let { time_aggregation } = searchParams || {}; 
                if ( time_aggregation ) {
                    time_aggregation = time_aggregation.split( ',' )[ 0 ] + ',sum';
                }

                const searchParams1 = { ...searchParams, reservoir_aggregation: 'sum' };
                const searchParams2 = { ...searchParams, location_aggregation: 'sum', time_aggregation };

                this._requestMakerCollection = new RequestMakerCollection( [
                    new SavingsRequestMaker( searchParams1 ),
                    new WeatherRequestMaker( searchParams2 )
                ] );
                break;
            }

            default:
                throw `Invalid endpoint (${endpoint}) used in RequestMakerFactory`;
        }
    }

    get requestMakerCollection(): RequestMakerCollection {
        return this._requestMakerCollection;
    }
}

export { RequestMakerFactory };