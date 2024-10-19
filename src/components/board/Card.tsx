"use client"

import { CardLineChart, CardPieChart } from "./Charts";
import { Unit } from "@/components/Unit";

import { CardHandlerFactory } from "@/logic/CardHandler";
import { withCommas } from "@/helpers/numbers";

import type { ObjectType } from "@/types";
import CardLayoutSpecifierFactory from "@/logic/LayoutSpecifier/CardLayoutSpecifierFactory";
import { CardLayoutSpecifier } from "@/logic/LayoutSpecifier";

type PropsType = { 
    option: string
    result: ObjectType
};

const Card = ( { option, result }: PropsType ) => {

    const layoutSpecifier = new CardLayoutSpecifierFactory( option ).layoutSpecifier;
    // to get the middle color for the mean temperature
    if ( option === 'temperature' ) {
        layoutSpecifier.colors = [ layoutSpecifier.colors[1] ];
    }
    const cardHandler = new CardHandlerFactory( option, result ).cardHandler;

    const evaluation: string = CardLayoutSpecifier.evaluation[ cardHandler.cluster ];
    const pieLabel = `Αξιολόγηση: ${cardHandler.cluster+1} (${evaluation})`;

    return (
        <div className="Card">
            <div className="Title">{ layoutSpecifier.title }</div>

            <div className="Info">
                <div>Τελευταία ενημέρωση: { cardHandler.date } </div>
                <div>
                    Μέτρηση: { withCommas(cardHandler.value) } <Unit unit={ cardHandler.unit }/>
                </div>
            </div>

            <CardLineChart 
                data={ cardHandler.recentEntries }
                label={ `Πρόσφατες μετρήσεις: ${cardHandler.interval}` }
                layoutSpecifier={ layoutSpecifier }
            />

            <CardPieChart 
                cluster={ cardHandler.cluster } 
                label={ pieLabel }
                layoutSpecifier={ layoutSpecifier }
            />
        </div>
    );
}

export { Card };
