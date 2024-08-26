"use client"

import { useState } from "react";
import ParamModal from "./ParamModal";
import type { SearchParamsType } from "@/types/searchParams";

type PropsType = {
    searchParams: SearchParamsType
}

export default function ParamLabel( { searchParams }: PropsType ) {

    const [ openModal, setOpenModal ] = useState( false );

    console.log( "rendering: ParamLabel..." )

    return (
        <>
        <div className="ParamLabel">
            [Παράμετροι]
            <button onClick={ e => setOpenModal( true ) }>
                [Modal]
            </button>
        </div>
        { 
            openModal 
            ? <ParamModal 
                onClose={ () => setOpenModal( false ) }
                searchParams={ searchParams }
            /> 
            : null 
        }
        </>    
    );
}
