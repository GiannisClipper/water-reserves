"use client"

import { useState } from "react";

export default function ParamSection() {

    const [ timeRange, setTimeRange ] = useState( '' );

    console.log( "rendering: ParamSection..." )

    return (
        <div className="ParamSection">
            <input 
                value={ timeRange }
                onChange={ e => setTimeRange( e.target.value ) }
            />
        </div>
    );
}

