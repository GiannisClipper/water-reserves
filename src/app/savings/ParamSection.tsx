import ParamState from "./ParamState";
import type { SearchParamsType } from "@/types/searchParams";
import { ReservoirsApiRequest } from "@/helpers/requests/ApiRequests";

type PropsType = {
    searchParams: SearchParamsType
}

const ParamSection = async ( { searchParams }: PropsType ) => {

    console.log( "rendering: ParamSection..." )

    return (
        <div className="ParamSection">
            <ParamState
                searchParams={ searchParams } 
            />
        </div>
    );
}

export default ParamSection;

