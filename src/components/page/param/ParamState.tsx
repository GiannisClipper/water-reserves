"use client"

import { useState } from "react";

import ParamLabel from "@/components/page/param/ParamLabel";
import ParamContent1 from "@/components/page/param/ParamContent1";
import ParamContent2 from "@/components/page/param/ParamContent2";
import ParamContent3 from "@/components/page/param/ParamContent3";

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
            endpoint === 'temperature'
            ?
            <ParamContent1
                endpoint={ endpoint }
                searchParams={ searchParams }
                error={ error }
                onPageRequest={ onPageRequest }
            />
            :
            endpoint === 'savings-production'
            ?
            <ParamContent2
                endpoint={ endpoint }
                searchParams={ searchParams }
                error={ error }
                onPageRequest={ onPageRequest }
            />
            :
            <ParamContent3
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

