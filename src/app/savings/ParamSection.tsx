import ParamLabel from "./ParamLabel";
import ParamContent from "./ParamContent";

type propsType = {
    searchParams: { time_range?: string }
}

const ParamSection = async ( { searchParams }: propsType ) => {

    console.log( "rendering: ParamSection..." )

    return (
        <div className="ParamSection">
            <ParamLabel />
            <ParamContent searchParams={searchParams} />
        </div>
    );
}

export default ParamSection;

