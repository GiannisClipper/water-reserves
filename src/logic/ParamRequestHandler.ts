import { ReservoirsApiRequest, FactoriesApiRequest, LocationsApiRequest } from "@/logic/ApiRequests";
import ObjectList from "@/helpers/objects/ObjectList";

import type { RequestErrorType } from '@/types/requestResult';
import type { ObjectType } from '@/types';

class ParamRequestHandler {

    _error: RequestErrorType | null = null;
    _items: ObjectType[] | null = null;

    constructor( endpoint: string ) {

        let ApiRequest: any;
        let sortKey: string = 'id';
        let sortDirection: 'asc' | 'desc' = 'asc';

        switch ( endpoint ) {

            case 'savings': {
                ApiRequest = ReservoirsApiRequest;
                sortKey = 'start';
                sortDirection = 'asc';
            } 
            case 'production': {
                ApiRequest = FactoriesApiRequest;
                sortKey = 'start';
                sortDirection = 'asc';
                break;
            }
            case 'precipitation': {
                ApiRequest = LocationsApiRequest;
                break;
            }
            default:
                throw `Invalid endpoint (${endpoint}) used in ParamRequestHandler`;
        }
    
        if ( ! ApiRequest ) {
            return this;
        }
    
        return ( async () => {

            const apiRequest = new ApiRequest();
            [ this._error, this._items ] = await apiRequest.request();

            if ( this._items ) {
                this._items = new ObjectList( this._items ).sortBy( sortKey, sortDirection );
            }

            return this;
        } )();
    };

    get error(): RequestErrorType | null {
        return this._error;
    } 

    get items(): ObjectType[] | null {
        return this._items;
    }

    toJSON(): ObjectType {
        return {
            error: this._error,
            items: this._items,
        }
    }
}

export { ParamRequestHandler };