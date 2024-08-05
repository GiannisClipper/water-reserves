"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

type searchParamsType = {
    time_range?: string
}

type propsType = {
    searchParams: searchParamsType
}

const ParamContent = ( { searchParams }: propsType ) => {

    const { time_range }: searchParamsType = searchParams || {};

    const [ timeRange, setTimeRange ] = useState( time_range || '' );

    const router = useRouter();

    const onClickProcess = () => {
        if ( timeRange && timeRange !== time_range ) {
            // const path: string = `savings?time_range=${timeRange}`
            // router.push( path );
    
            const url: string = "http://localhost:3000/savings?" + `time_range=${timeRange}`    
            location.href = url;
        }
    }

    console.log( "rendering: ParamContent..." )

    return (
        <div className="ParamContent">
            <div>
                Time range
                <input 
                    value={ timeRange }
                    onChange={ e => setTimeRange( e.target.value ) }
                />
            </div>
            <div>
                <button
                    onClick={ e => onClickProcess() }
                >
                    Process params
                </button>
            </div>
        </div>
    );
}

export default ParamContent;
