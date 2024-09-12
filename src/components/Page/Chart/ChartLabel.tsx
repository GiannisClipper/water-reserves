"use client"

import { Left, Right } from "@/components/Generics";
import { ChartLineIcon, ChartAreaIcon, ChartBarIcon, LinkIcon, ScreenIcon, DownloadIcon } from "@/components/Icons";
import { downloadChart } from "@/logic/_common/download";
import type { RequestResultType } from "@/types/requestResult";

import "@/styles/label.css"

type PropsType = { 
    result: RequestResultType | null
    setChartType: CallableFunction 
}

export default function ChartLabel( { result, setChartType }: PropsType ) {

    const setChartLine = () => setChartType( 'line' );
    const setChartArea = () => setChartType( 'area' );
    const setChartBar = () => setChartType( 'bar' );
    
    console.log( "rendering: ChartLabel..." )

    return (
        <div className="Label ChartLabel">
            <Left>
                Γραφήματα
            </Left>
            { 
            result
            ?
            <Right>
                <ChartLineIcon className="icon" title="Γράφημα γραμμής" onClick={ setChartLine } />
                <ChartAreaIcon className="icon" title="Γράφημα περιοχής" onClick={ setChartArea } />
                <ChartBarIcon className="icon" title="Γράφημα με μπάρες" onClick={ setChartBar } />
                <ScreenIcon className="icon" title="Ευρεία οθόνη" />
                <LinkIcon className="icon" title="Σύνδεσμος ευρείας οθόνης" />
                <DownloadIcon className="icon" title="Κατέβασμα σε αρχείο" onClick={ downloadChart } />
            </Right>
            :
            null
            }
        </div>
    );
}


