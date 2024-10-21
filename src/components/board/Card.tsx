"use client"

import { CardLineChart, CardPieChart } from "./Charts";
import { Unit } from "@/components/Unit";

import { CardHandlerFactory } from "@/logic/CardHandler";
import { withCommas } from "@/helpers/numbers";

import type { ObjectType } from "@/types";
import CardLayoutSpecifierFactory from "@/logic/LayoutSpecifier/CardLayoutSpecifierFactory";
import { CardLayoutSpecifier, ChartLayoutSpecifier } from "@/logic/LayoutSpecifier";

type PropsType = { 
    option: string
    result: ObjectType
};

const Card = ( { option, result }: PropsType ) => {

    const layoutSpecifier = new CardLayoutSpecifierFactory( option ).layoutSpecifier;
    const cardHandler = new CardHandlerFactory( option, result ).cardHandler;

    const evaluation: string = CardLayoutSpecifier.evaluation[ cardHandler.cluster ];
    const pieLabel = `Evaluation: ${cardHandler.cluster+1} (${evaluation})`;

    return (
        <div className="Card">
            <div className="Title">{ layoutSpecifier.title }</div>

            <div className="Info">
                <div>Last update: { cardHandler.date } </div>
                <div>
                    Measurement: { withCommas(cardHandler[ layoutSpecifier.yKeys[ 0 ] ]) } <Unit unit={ layoutSpecifier.unit }/>
                </div>
            </div>

            <CardLineChart 
                data={ cardHandler.recentEntries }
                label={ `Recent measurements: ${cardHandler.interval}` }
                layoutSpecifier={ layoutSpecifier as ChartLayoutSpecifier }
            />

            <CardPieChart 
                cluster={ cardHandler.cluster } 
                label={ pieLabel }
                layoutSpecifier={ layoutSpecifier as ChartLayoutSpecifier }
            />
        </div>
    );
}

export { Card };
