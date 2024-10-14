"use client"

import { Left, Right } from "@/components/Generics";
import { ChartLineIcon, MapIcon, LinkIcon, ScreenIcon, DownloadIcon } from "@/components/Icons";

import { downloadChart } from "@/logic/download";
import BrowserUrl from "@/helpers/url/BrowserUrl";

import "@/styles/label.css"

type PropsType = { 
    setChartType: CallableFunction 
}

export default function ChartLabel( { setChartType }: PropsType ) {

    const setChartLine = () => setChartType( 'line' );
    const setChartLine2 = () => setChartType( 'line2' );
    const setMap = () => setChartType( 'map' );
    
    const expandChart = (): void => {
        const url: BrowserUrl = new BrowserUrl( window );
        const pathname: string = url.getPathname() + '/chart';
        url.setPathname( pathname );
        url.openBlank();
    }

    console.log( "rendering: ChartLabel2..." )

    return (
        <div className="Label ChartLabel">
            <Left>
                Γραφήματα
            </Left>
            <Right>
                <ChartLineIcon className="icon" title="Γράφημα γραμμής" onClick={ setChartLine } />
                <ChartLineIcon className="icon" title="Γράφημα γραμμής 2" onClick={ setChartLine2 } />
                <MapIcon className="icon" title="Χάρτης" onClick={ setMap } />
                <ScreenIcon className="icon" title="Ευρεία οθόνη" onClick={ expandChart } />
                <LinkIcon className="icon" title="Σύνδεσμος ευρείας οθόνης" />
                <DownloadIcon className="icon" title="Κατέβασμα σε αρχείο" onClick={ downloadChart } />
            </Right>
        </div>
    );
}


