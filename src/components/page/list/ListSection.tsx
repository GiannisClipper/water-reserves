import ListLabel from "@/components/page/list/ListLabel";
import StandardListContent from "@/components/page/list/StandardListContent";

import ListLayoutHandlerFactory from "@/logic/LayoutHandler/list/ListLayoutHandlerFactory";

import type { SearchParamsType } from "@/types/searchParams";
import type { ObjectType } from "@/types";

type PropsType = {
    endpoint: string
    searchParams: SearchParamsType
    dataBox: ObjectType
}

const ListSection = ( { endpoint, searchParams, dataBox }: PropsType  ) => {

    // await new Promise( resolve => setTimeout( resolve, 1000 ) )
    // const result: number = Math.floor( Math.random() * 10 );

    const layoutHandler = new ListLayoutHandlerFactory( endpoint, searchParams, dataBox )
        .handler;

    console.log( "rendering: ListSection..." )

    return (
        <div className="ListSection">
            <ListLabel />

            <StandardListContent
                dataBox={ dataBox }
                layoutHandler={ layoutHandler }
            />
        </div>
    );
}

export default ListSection;