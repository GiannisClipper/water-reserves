"use client"

import { Left, Right } from "@/components/Generics";
import { ChartLineIcon, ChartAreaIcon, ChartBarIcon, LinkIcon, ScreenIcon, DownloadIcon } from "@/components/Icons";
import BrowserUrl from "@/helpers/url/BrowserUrl";
import { downloadChart } from "@/logic/download";
import type { RequestResultType } from "@/types/requestResult";

import "@/styles/label.css"

type PropsType = { 
    setChartType: CallableFunction 
}

export default function ChartLabel( { setChartType }: PropsType ) {

    const setChartLine = () => setChartType( 'line' );
    const setChartArea = () => setChartType( 'area' );
    const setChartBar = () => setChartType( 'bar' );
    
    const expandChart = (): void => {
        const url: BrowserUrl = new BrowserUrl( window );
        const pathname: string = url.getPathname() + '/chart';
        url.setPathname( pathname );
        url.openBlank();
    }

    console.log( "rendering: ChartLabel..." )

    return (
        <div className="Label ChartLabel">
            <Left>
                Γραφήματα
            </Left>
            <Right>
                <ChartLineIcon className="icon" title="Γράφημα γραμμής" onClick={ setChartLine } />
                <ChartAreaIcon className="icon" title="Γράφημα περιοχής" onClick={ setChartArea } />
                <ChartBarIcon className="icon" title="Γράφημα με μπάρες" onClick={ setChartBar } />
                <ScreenIcon className="icon" title="Ευρεία οθόνη" onClick={ expandChart } />
                <LinkIcon className="icon" title="Σύνδεσμος ευρείας οθόνης" />
                <DownloadIcon className="icon" title="Κατέβασμα σε αρχείο" onClick={ downloadChart } />
            </Right>
        </div>
    );
}


