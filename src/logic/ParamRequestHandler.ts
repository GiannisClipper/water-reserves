import { ApiRequestFactory } from "@/logic/ApiRequest";
import ObjectList from "@/helpers/objects/ObjectList";

import type { RequestErrorType } from '@/types/requestResult';
import type { ObjectType } from '@/types';

class ParamRequestHandler {

    _error: RequestErrorType | null = null;
    _items: ObjectType[] | null = null;

    constructor( endpoint: string ) {

        return ( async () => {

            const endpoints: ObjectType = {
                'savings': 'reservoirs',
                'production': 'factories',
                'precipitation': 'locations',
            };

            const apiRequest = new ApiRequestFactory( endpoints[ endpoint ] ).apiRequest;
            [ this._error, this._items ] = await apiRequest.request();

            if ( this._items ) {

                let sortKey: string = 'id';
                let sortDirection: 'asc' | 'desc' = 'asc';

                if ( [ 'savings', 'production' ].includes( endpoint ) ) {
                    sortKey = 'start';
                    sortDirection = 'asc';
                }        

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