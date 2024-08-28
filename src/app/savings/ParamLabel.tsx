import type { SearchParamsType } from "@/types/searchParams";

type PropsType = {
    searchParams: SearchParamsType
}

export default function ParamLabel( { searchParams }: PropsType ) {

    console.log( "rendering: ParamLabel..." )

    return (
        <div className="ParamLabel">
            [Παράμετροι]
        </div>
    );
}
