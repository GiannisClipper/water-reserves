import ListLabel from "@/components/page/list/ListLabel";
import StandardListContent from "@/components/page/list/StandardListContent";

import DataParser from "@/logic/DataParser";
import ListLayoutHandlerFactory from "@/logic/LayoutHandler/list/ListLayoutHandlerFactory";

import type { SearchParamsType } from "@/types/searchParams";
import type { RequestResultType } from "@/types/requestResult";

type PropsType = {
    endpoint: string
    searchParams: SearchParamsType
    result: RequestResultType | null
    dataParser: DataParser
}

const ListSection = ( { endpoint, searchParams, result, dataParser }: PropsType  ) => {

    // await new Promise( resolve => setTimeout( resolve, 1000 ) )
    // const result: number = Math.floor( Math.random() * 10 );

    const layoutHandler = new ListLayoutHandlerFactory( endpoint, searchParams, dataParser )
        .handler;

    console.log( "rendering: ListSection..." )

    return (
        <div className="ListSection">
            <ListLabel />

            <StandardListContent
                dataParser={ dataParser }
                layoutHandler={ layoutHandler }
            />
        </div>
    );
}

export default ListSection;