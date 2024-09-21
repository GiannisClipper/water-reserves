import { ObjectType } from '@/types';

type ErrorType = { message: string };

class ParamsValidation {    

    time_range: string | undefined;

    constructor( searchParams: ObjectType ) {
        this.time_range = searchParams.time_range;
    }

    validate(): ErrorType | null {

        if ( ! this.time_range ) {
            const error: ErrorType = {
                message: "Δεν έχει οριστεί χρονική περίοδος δεδομένων."
            };
            return error;
        }
        return null;
    };
}

export { ParamsValidation };