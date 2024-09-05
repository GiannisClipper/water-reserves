import ParamState from "./ParamState";
import type { SearchParamsType } from "@/types/searchParams";
import { ReservoirsApiRequest } from "@/helpers/requests/ApiRequests";

type PropsType = {
    searchParams: SearchParamsType
}

const ParamSection = async ( { searchParams }: PropsType ) => {

    const reservoirsApiRequest = new ReservoirsApiRequest();

    const [ error, reservoirs ] = await reservoirsApiRequest.request();

    console.log( error, reservoirs );

    console.log( "rendering: ParamSection..." )

    return (
        <div className="ParamSection">
            <ParamState
                searchParams={ searchParams } 
                error={ error }
                reservoirs={ reservoirs }
            />
        </div>
    );
}

export default ParamSection;

