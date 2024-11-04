import ParamState from "./ParamState";

import { RequestMakerFactory } from "@/logic/RequestMaker/RequestMakerFactory";

import type { SearchParamsType } from "@/types/searchParams";
import type { ObjectType } from "@/types";

type PropsType = {
    endpoint: string
    searchParams: SearchParamsType
}

const ParamSection = async ( { endpoint, searchParams }: PropsType ) => {

    const endpoints: ObjectType = {
        'savings': 'reservoirs',
        'production': 'factories',
        'precipitation': 'locations',
        'temperature': 'locations',
        'interruptions': 'municipalities',
    };

    let error = null, result = null;

    if ( endpoints[ endpoint ] ) {
        const requestMakerCollection = new RequestMakerFactory( endpoints[ endpoint ] ).requestMakerCollection;
        ( { error, result } = ( await requestMakerCollection.request() ).toJSON() );

        if ( result ) {
            const key = Object.keys( result )[ 0 ];
            result = result[ key ];
        }
    }

    console.log( "rendering: ParamSection..." )

    return (
        <div className="ParamSection">
            <ParamState
                endpoint={ endpoint }
                searchParams={ searchParams } 
                error={ error }
                items={ result }
            />
        </div>
    );
}

export default ParamSection;

