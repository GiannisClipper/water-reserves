"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchParamsType } from "./page";

type PropsType = {
    searchParams: SearchParamsType
}

const ParamContent = ( { searchParams }: PropsType ) => {

    const { time_range, chart_type }: SearchParamsType = searchParams || {};

    const [ timeRange, setTimeRange ] = useState( time_range || '' );
    const [ chartType, setChartType ] = useState( chart_type || '' );

    const router = useRouter();

    const onClickProcess = () => {
        const queryParams: string = `?time_range=${timeRange}&chart_type=${chartType}`;
        if ( timeRange && timeRange !== time_range ) {
            const url: string = "http://localhost:3000/savings" + queryParams;
            location.href = url;
        }

        if ( chartType && chartType !== chart_type ) {    
            const path: string = "savings" + queryParams;
            router.push( path );
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
                Chart type
                <input 
                    value={ chartType }
                    onChange={ e => setChartType( e.target.value ) }
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
