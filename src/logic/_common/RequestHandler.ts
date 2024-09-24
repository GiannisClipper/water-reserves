import type { ObjectType } from '@/types';
import { ParamsValidation } from "@/logic/_common/ParamsValidation";
import { SavingsApiRequest } from "@/logic/_common/ApiRequests";

import type { SearchParamsType } from "@/types/searchParams";
import type { RequestErrorType, RequestResultType } from '@/types/requestResult';

class RequestHandler {    

    _error: RequestErrorType | null = null;
    _result: RequestResultType | null = null;

    constructor( endpoint: string, searchParams: SearchParamsType ) {

        return ( async () => {
            if ( Object.keys( searchParams ).length === 0 ) {
                return this;
            }

            this._error = new ParamsValidation( searchParams ).validate();

            if ( ! this._error ) {
                const apiRequest = new SavingsApiRequest( searchParams );
                [ this._error, this._result ] = await apiRequest.request();
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

export { RequestHandler };