"use client"

import { useState } from "react";

import ParamLabel from "@/components/page/param/ParamLabel";
import ParamContent from "@/components/page/param/ParamContent";
import ParamContentWithItems from "@/components/page/param/ParamContentWithItems";

import type { SavingsSearchParamsType } from "@/types/searchParams";
import type { RequestErrorType, RequestResultType } from '@/types/requestResult';

type PropsType = {
    endpoint: string
    searchParams: SavingsSearchParamsType
    error: RequestErrorType | null
    items?: RequestResultType
}

const ParamState = ( { endpoint, searchParams, error, items }: PropsType ) => {

    const [ onPageRequest, setOnPageRequest ] = useState<boolean>( false );

    console.log( "rendering: ParamState..." )

    return (
        <div className="ParamState">
            <ParamLabel 
                searchParams={ searchParams } 
                setOnPageRequest={ setOnPageRequest }
            />

            { 
            endpoint === 'savings-production'
            ?
            <ParamContent
                endpoint={ endpoint }
                searchParams={ searchParams }
                error={ error }
                onPageRequest={ onPageRequest }
            />
            :
            <ParamContentWithItems
                endpoint={ endpoint }
                searchParams={ searchParams }
                error={ error }
                onPageRequest={ onPageRequest }
                items={ items as RequestResultType }
            />
            }
        </div>
    );
}

export default ParamState;

