"use client"

import ChartLabel from "./ChartLabel";
import { ChartBarIcon, MapIcon } from "@/components/Icons";
import StandardChartLabel from "@/components/page/chart/label/StandardChartLabel";
import type { ObjectType } from "@/types";
import "@/styles/label.css"

type PropsType = { 
    setChartType: CallableFunction 
    dataBox: ObjectType
}

function SpatialChartLabel( { setChartType, dataBox }: PropsType ) {

    const setChartBar = () => setChartType( 'bar' );
    const setMap = () => setChartType( 'map' );

    return (
        <ChartLabel>
            <ChartBarIcon className="icon" title="Bar chart" onClick={ setChartBar } />
            <MapIcon className="icon" title="Map" onClick={ setMap } />
        </ChartLabel>
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