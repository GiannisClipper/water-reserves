"use client";

import { Left, Right } from "@/components/Generics";
import { ChartLineIcon, ChartAreaIcon, ChartBarIcon, LinkIcon, ScreenIcon } from "@/components/Icons";

import "@/styles/label.css"

type PropsType = { setChartType: CallableFunction }

export default function ChartLabel( { setChartType }: PropsType ) {

    const setChartLine = () => setChartType( 'line' );
    const setChartArea = () => setChartType( 'area' );
    const setChartBar = () => setChartType( 'bar' );
    
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
                <ScreenIcon className="icon" title="Ευρεία οθόνη" />
                <LinkIcon className="icon" title="Σύνδεσμος γραφήματος" />
            </Right>
        </div>
    );
}


