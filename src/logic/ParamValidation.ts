import { ObjectType } from '@/types';

type ErrorType = { message: string };

class ParamValidation {    

    time_range: string | undefined;

    constructor( searchParams: ObjectType ) {
        this.time_range = searchParams.time_range;
    }

    validate(): ErrorType | null {

        if ( ! this.time_range ) {
            const error: ErrorType = {
                message: "No time range has been defined."
            };
            return error;
        }
        return null;
    };
}

export { ParamValidation };