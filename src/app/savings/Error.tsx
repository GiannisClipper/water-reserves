import { RequestErrorType } from "@/types/requestResult"

type PropsType = { error: RequestErrorType }

const Error = ( { error }: PropsType ) => {

    return (
        <div className="Error">

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
