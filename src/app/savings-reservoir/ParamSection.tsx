import ParamState from "./ParamState";
import type { SearchParamsType } from "@/types/searchParams";
import { ReservoirsApiRequest } from "@/logic/ApiRequests";

type PropsType = {
    searchParams: SearchParamsType
}

const ParamSection = async ( { searchParams }: PropsType ) => {

    console.log( "rendering: ParamSection..." )

    const reservoirsApiRequest = new ReservoirsApiRequest();
    const [ error, reservoirs ] = await reservoirsApiRequest.request();
    // console.log( error, reservoirs );

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

