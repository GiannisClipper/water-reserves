"use client"

import { useState } from "react";

import ParamLabel from "@/components/page/param/ParamLabel";
import ParamContent from "@/components/page/param/ParamContent";
import MultiParamContent from "@/components/page/param/MultiParamContent";

import type { SavingsSearchParamsType } from "@/types/searchParams";
import type { RequestErrorType, RequestResultType } from '@/types/requestResult';

type PropsType = {
    endpoint: string
    searchParams: SavingsSearchParamsType
    items?: RequestResultType | null
    error: RequestErrorType | null
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
            <MultiParamContent
                endpoint={ endpoint }
                searchParams={ searchParams }
                error={ error }
                onPageRequest={ onPageRequest }
            />
            :
            <ParamContent
                endpoint={ endpoint }
                searchParams={ searchParams }
                items={ items }
                error={ error }
                onPageRequest={ onPageRequest }
            />
            }
        </div>
    );
}

export default ParamState;

