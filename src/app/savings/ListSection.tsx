import ListLabel from "@/components/Page/List/ListLabel";
import ListContent from "@/components/Page/List/ListContent";

import { getHeaders } from '@/logic/savings/list';
import { getAggregatedData } from '@/logic/savings/_common';

import { ObjectType } from "@/types";
import type { RequestResultType } from "@/types/requestResult";

type PropsType = { result: RequestResultType | null }

const ListSection = async ( { result }: PropsType ) => {

    // await new Promise( resolve => setTimeout( resolve, 1000 ) )
    // const result: number = Math.floor( Math.random() * 10 );

    const headers: string[] = getHeaders( result );
    const data: ObjectType[] = getAggregatedData( result );

    console.log( "rendering: ListSection..." )

    return (
        <div className="ListSection">
            <ListLabel result={result} />
            <ListContent 
                headers={headers} 
                data={data} 
            />
        </div>
    );
}

export default ListSection;