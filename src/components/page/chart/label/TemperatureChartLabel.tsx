"use client"

import ChartLabel from "./ChartLabel";
import { ChartLineIcon } from "@/components/Icons";
import type { ObjectType } from "@/types";
import "@/styles/label.css"

type PropsType = { 
    setChartType: CallableFunction 
    dataBox: ObjectType
}

export default function TemperatureChartLabel( { setChartType, dataBox }: PropsType ) {

    const setChartBar = () => setChartType( 'line' );
    
    return (
        <ChartLabel>
            <ChartLineIcon className="icon" title="Line chart" onClick={ setChartBar } />
        </ChartLabel>
    );
}

export { TemperatureChartLabel };