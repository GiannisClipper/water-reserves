"use client"

import ChartLabel from "./ChartLabel";
import { ChartLineIcon, ChartAreaIcon, ChartBarIcon } from "@/components/Icons";
import type { ObjectType } from "@/types";
import "@/styles/label.css"

type PropsType = { 
    setChartType: CallableFunction 
    dataBox: ObjectType
}

export default function StandardChartLabel( { setChartType, dataBox }: PropsType ) {

    const setChartLine = () => setChartType( 'line' );
    const setChartArea = () => setChartType( 'area' );
    const setChartBar = () => setChartType( 'bar' );
    
    return (
        <ChartLabel>
            <ChartLineIcon className="icon" title="Line chart" onClick={ setChartLine } />
            <ChartAreaIcon className="icon" title="Area chart" onClick={ setChartArea } />
            <ChartBarIcon className="icon" title="Bar chart" onClick={ setChartBar } />
        </ChartLabel>
    );
}


