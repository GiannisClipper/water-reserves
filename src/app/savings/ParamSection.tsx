import ParamLabel from "./ParamLabel";
import ParamContent from "./ParamContent";
import type { SearchParamsType } from "@/types/searchParams";

type PropsType = {
    searchParams: SearchParamsType
}

const ParamSection = async ( { searchParams }: PropsType ) => {

    console.log( "rendering: ParamSection..." )

    return (
        <div className="ParamSection">
            <ParamLabel searchParams={searchParams} />
            <ParamContent searchParams={searchParams} />
        </div>
    );
}

export default ParamSection;

