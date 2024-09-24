import ParamState from "./ParamState";
import { ParamRequestHandler } from "@/logic/_common/ParamRequestHandler";
import type { SearchParamsType } from "@/types/searchParams";

type PropsType = {
    endpoint: string
    searchParams: SearchParamsType
}

const ParamSection = async ( { endpoint, searchParams }: PropsType ) => {

    console.log( "rendering: ParamSection..." )

    const requestHandler = await new ParamRequestHandler( endpoint );
    const { error, items } = requestHandler.toJSON();

    // console.log( error, reservoirs );

    return (
        <div className="ParamSection">
            <ParamState
                endpoint={ endpoint }
                searchParams={ searchParams } 
                error={ error }
                items={ items }
            />
        </div>
    );
}

export default ParamSection;

