import { RequestErrorType } from "@/types/requestResult"
import { ErrorIcon } from "@/components/Icons";

type PropsType = { error: RequestErrorType }

const Error = ( { error }: PropsType ) => {

    return (
        <div className="Error">

            <div>
                <ErrorIcon className="icon" />
            </div>

            { error.statusCode 
            ? <div>{ `${error.statusCode} ${error.statusText}` }</div>
            : null }

            { error.message 
            ? <div>{ `${error.message}` }</div>
            : null }

        </div>
    );

}

export default Error;
