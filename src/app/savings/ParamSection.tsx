import ParamLabel from "./ParamLabel";
import ParamContent from "./ParamContent";
import type { SearchParamsType } from "./page";

type PropsType = {
    searchParams: SearchParamsType
}

const ParamSection = async ( { searchParams }: PropsType ) => {

    console.log( "rendering: ParamSection..." )

    return (
        <div className="ParamSection">
            <ParamLabel />
            <ParamContent searchParams={searchParams} />
        </div>
    );
}

export default ParamSection;

