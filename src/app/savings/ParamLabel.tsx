"use client"
import { useState } from "react";
import ParamModal from "./ParamModal";

export default function ParamLabel() {

    const [ openModal, setOpenModal ] = useState( false )

    console.log( "rendering: ParamLabel..." )

    return (
        <>
        <div className="ParamLabel">
            [ParamLabel]
            <button onClick={ e => setOpenModal( true ) }>
                [Modal]
            </button>
        </div>
        { 
            openModal 
            ? <ParamModal onClose={ () => setOpenModal( false ) }/> 
            : null 
        }
        </>    
    );
}
