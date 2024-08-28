"use client"

import { Left, Right } from "@/components/Generics";
import type { SearchParamsType } from "@/types/searchParams";
import { ChartLineIcon, ChartAreaIcon, ChartBarIcon, LinkIcon, ExpandIcon } from "@/components/Icons";

import "@/styles/label.css"

type PropsType = {
    searchParams: SearchParamsType
}

export default function ChartLabel( { searchParams }: PropsType ) {

    console.log( "rendering: ChartLabel..." )

    return (
        <div className="Label ChartLabel">
            <Left>
                Γραφήματα
            </Left>
            <Right>
                <ChartLineIcon className="icon" title="Γράφημα γραμμής" />
                <ChartAreaIcon className="icon" title="Γράφημα περιοχής" />
                <ChartBarIcon className="icon" title="Γράφημα με μπάρες" />
                <ExpandIcon className="icon" title="Πλήρης οθόνη" />
                <LinkIcon className="icon" title="Σύνδεσμος γραφήματος" />
            </Right>
        </div>
    );
}


