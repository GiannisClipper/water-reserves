"use client"

import { Left, Right } from "@/components/Generics";
import { ChartBarIcon, MapIcon, LinkIcon, ScreenIcon, DownloadIcon } from "@/components/Icons";
import StandardChartLabel from "@/components/page/chart/label/StandardChartLabel";

import { downloadChart } from "@/logic/download";
import BrowserUrl from "@/helpers/url/BrowserUrl";
import type { ObjectType } from "@/types";
import "@/styles/label.css"

type PropsType = { 
    setChartType: CallableFunction 
    dataBox: ObjectType
}

const SpatialChartLabel = ( { setChartType, dataBox }: PropsType ) => {

    const setChartBar = () => setChartType( 'bar' );
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
                Charts
            </Left>
            <Right>
                <ChartBarIcon className="icon" title="Bar chart" onClick={ setChartBar } />
                <MapIcon className="icon" title="Map" onClick={ setMap } />
                <ScreenIcon className="icon" title="Wide view" onClick={ expandChart } />
                <LinkIcon className="icon" title="Wide view link" />
                <DownloadIcon className="icon" title="Download as image" onClick={ downloadChart } />
            </Right>
        </div>
    );
}

const InterruptionsChartLabel = ( { dataBox, setChartType }: PropsType ) => {

    switch ( dataBox.type ) {

        case 'standard':
            return ( <StandardChartLabel
                dataBox={ dataBox }
                setChartType={ setChartType }
            /> );

        case 'standard,spatial':
            return ( <SpatialChartLabel
                dataBox={ dataBox }
                setChartType={ setChartType }
            /> );

        default:
            return null;
    }
}

export { InterruptionsChartLabel };