import type { ObjectType } from '@/types';
import { ParamValidation } from "@/logic/ParamValidation";
import { SavingsApiRequest, ProductionApiRequest } from "@/logic/ApiRequests";

import type { SearchParamsType } from "@/types/searchParams";
import type { RequestErrorType, RequestResultType } from '@/types/requestResult';

class DataRequestHandler {    

    _error: RequestErrorType | null = null;
    _result: RequestResultType | null = null;

    constructor( endpoint: string, searchParams: SearchParamsType ) {

        return ( async () => {
            if ( Object.keys( searchParams ).length === 0 ) {
                return this;
            }

            this._error = new ParamValidation( searchParams ).validate();

            if ( ! this._error ) {
                switch ( endpoint ) {

                    case 'savings': {
                        const apiRequest = new SavingsApiRequest( searchParams );
                        [ this._error, this._result ] = await apiRequest.request();
                        break;
                    }

                    case 'production': {
                        const apiRequest = new ProductionApiRequest( searchParams );
                        [ this._error, this._result ] = await apiRequest.request();    
                        break;
                    }

                    default:
                        throw `Invalid endpoint (${endpoint}) used in DataRequestHandler`;
                }
            }
            return this;
        } )();
    };

    get error(): RequestErrorType | null {
        return this._error;
    } 

    get result(): RequestResultType | null {
        return this._result;
    }

    toJSON(): ObjectType {
        return {
            error: this._error,
            result: this._result,
        }
    }
}

export { DataRequestHandler };