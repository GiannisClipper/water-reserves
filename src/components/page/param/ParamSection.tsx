import ParamState from "./ParamState";

import { ApiRequest, ApiRequestFactory } from "@/logic/ApiRequest";

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
    };

    const apiRequest: ApiRequest = new ApiRequestFactory( endpoints[ endpoint ] ).apiRequest;
    const { error, result } = ( await apiRequest.request() ).toJSON();

    console.log( "rendering: ParamSection...", result, error )

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

