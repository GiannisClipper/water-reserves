import ListLabel from "@/components/Page/List/ListLabel";
import SingleListContent from "../../components/Page/List/SingleListContent";
import StackListContent from "../../components/Page/List/StackListContent";

import { makeDataContext } from "@/logic/_common/DataParser";

import type { SearchParamsType } from "@/types/searchParams";
import type { RequestResultType } from "@/types/requestResult";

type PropsType = {
    endpoint: string
    searchParams: SearchParamsType
    result: RequestResultType | null
}

const ListSection = ( { endpoint, searchParams, result }: PropsType  ) => {

    const { displayMode, itemsKey, dataParser } = makeDataContext( { endpoint, searchParams, result } );

    // await new Promise( resolve => setTimeout( resolve, 1000 ) )
    // const result: number = Math.floor( Math.random() * 10 );

    const ListContent: any = displayMode === 'single'
        ? SingleListContent
        : StackListContent;

    console.log( "rendering: ListSection..." )

    return (
        <div className="ListSection">
            <ListLabel />

            <ListContent
                dataParser={ dataParser }
            />
        </div>
    );
}

export default ListSection;