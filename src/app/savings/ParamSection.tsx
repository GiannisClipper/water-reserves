import ParamLabel from "./ParamLabel";
import ParamContent from "./ParamContent";

export default function ParamSection() {

    console.log( "rendering: ParamSection..." )

    return (
        <div className="ParamSection">
            <span>Param section...</span>
            <ParamLabel />
            <ParamContent />
        </div>
    );
}

