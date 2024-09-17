import ParamState from "./ParamState";
import type { SearchParamsType } from "@/types/searchParams";
import ObjectList from "@/helpers/objects/ObjectList";
import { ReservoirsApiRequest } from "@/logic/_common/ApiRequests";

type PropsType = {
    searchParams: SearchParamsType
}

const ParamSection = async ( { searchParams }: PropsType ) => {

    console.log( "rendering: ParamSection..." )

    const reservoirsApiRequest = new ReservoirsApiRequest();
    let [ error, reservoirs ] = await reservoirsApiRequest.request();
    reservoirs = new ObjectList( reservoirs ).sortBy( 'start', 'asc' );
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

