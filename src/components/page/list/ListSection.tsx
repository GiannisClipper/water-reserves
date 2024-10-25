import ListLabel from "@/components/page/list/ListLabel";
import SingleListContent from "@/components/page/list/SingleListContent";
import StackListContent from "@/components/page/list/StackListContent";

import DataParserFactory from "@/logic/DataParser/DataParserFactory";

import type { SearchParamsType } from "@/types/searchParams";
import type { RequestResultType } from "@/types/requestResult";
import type { ObjectType } from "@/types";

type PropsType = {
    endpoint: string
    searchParams: SearchParamsType
    result: RequestResultType | null
}

const ListSection = ( { endpoint, searchParams, result }: PropsType  ) => {

    const dataParser = new DataParserFactory( { endpoint, searchParams, result } ).dataParser;

    // await new Promise( resolve => setTimeout( resolve, 1000 ) )
    // const result: number = Math.floor( Math.random() * 10 );

    const listContents: ObjectType = {
        'standard': SingleListContent,
        'stack': StackListContent,
    };
    const ListContent = listContents[ dataParser.type ];

    console.log( "rendering: ListSection..." )

    return (
        <div className="ListSection">
            <ListLabel />

            {/* <ListContent
                dataParser={ dataParser }
            /> */}
        </div>
    );
}

export default ListSection;