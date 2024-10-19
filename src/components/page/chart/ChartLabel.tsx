"use client"

import { Left, Right } from "@/components/Generics";
import { ChartLineIcon, ChartAreaIcon, ChartBarIcon, LinkIcon, ScreenIcon, DownloadIcon } from "@/components/Icons";

import { downloadChart } from "@/logic/download";
import BrowserUrl from "@/helpers/url/BrowserUrl";

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
                Charts
            </Left>
            <Right>
                <ChartLineIcon className="icon" title="Line chart" onClick={ setChartLine } />
                <ChartAreaIcon className="icon" title="Area chart" onClick={ setChartArea } />
                <ChartBarIcon className="icon" title="Bar chart" onClick={ setChartBar } />
                <ScreenIcon className="icon" title="Wide view" onClick={ expandChart } />
                <LinkIcon className="icon" title="Wide view link" />
                <DownloadIcon className="icon" title="Download as image" onClick={ downloadChart } />
            </Right>
        </div>
    );
}


