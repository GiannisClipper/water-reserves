import ListLabel from "@/components/page/list/ListLabel";
import SingleListContent from "@/components/page/list/SingleListContent";
import StackListContent from "@/components/page/list/StackListContent";
import MultiListContent from "@/components/page/list/MultiListContent";

import DataHandlerFactory from "@/logic/DataHandler/DataHandlerFactory";

import type { SearchParamsType } from "@/types/searchParams";
import type { RequestResultType } from "@/types/requestResult";
import type { ObjectType } from "@/types";

type PropsType = {
    endpoint: string
    searchParams: SearchParamsType
    result: RequestResultType | null
}

const ListSection = ( { endpoint, searchParams, result }: PropsType  ) => {

    const dataHandler = new DataHandlerFactory( { endpoint, searchParams, result } ).dataHandler;

    // await new Promise( resolve => setTimeout( resolve, 1000 ) )
    // const result: number = Math.floor( Math.random() * 10 );

    const listContents: ObjectType = {
        'single': SingleListContent,
        'stack': StackListContent,
        'multi': MultiListContent,
    };
    const ListContent = listContents[ dataHandler.type ];

    console.log( "rendering: ListSection..." )

    return (
        <div className="ListSection">
            <ListLabel />

            {/* <ListContent
                dataHandler={ dataHandler }
            /> */}
        </div>
    );
}

export default ListSection;