import ListLabel from "@/components/page/list/ListLabel";
import StandardListContent from "@/components/page/list/StandardListContent";
import StackListContent from "@/components/page/list/StackListContent";

import DataParser from "@/logic/DataParser";
import ListLayoutHandlerFactory from "@/logic/LayoutHandler/list/ListLayoutHandlerFactory";

import type { SearchParamsType } from "@/types/searchParams";
import type { RequestResultType } from "@/types/requestResult";
import type { ObjectType } from "@/types";

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

    const listContents: ObjectType = {
        'standard': StandardListContent,
        'stack': StackListContent,
    };
    const ListContent = listContents[ dataParser.type ];

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