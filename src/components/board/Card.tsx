"use client"

import { CardLineChart, CardPieChart } from "./Charts";
import { Unit } from "@/components/Unit";

import { CardHandlerFactory } from "@/logic/CardHandler";
import { withCommas } from "@/helpers/numbers";

import type { ObjectType } from "@/types";
import LayoutSpecifierFactory from "@/logic/LayoutSpecifier/LayoutSpecifierFactory";

type PropsType = { 
    option: string
    result: ObjectType
};

const Card = ( { option, result }: PropsType ) => {

    const layoutSpecifier = new LayoutSpecifierFactory( option, {} ).layoutSpecifier;
    // to get the middle color for the mean temperature
    if ( option === 'temperature' ) {
        layoutSpecifier.colors = [ layoutSpecifier.colors[1] ];
    }
    const cardHandler = new CardHandlerFactory( option, result ).cardHandler;

    const titles: ObjectType = { 
        'savings': 'Αποθέματα νερού',
        'production': 'Παραγωγή πόσιμου νερού',
        'precipitation': 'Μετρήσεις υετού',
        'temperature': 'Μέση θερμοκρασία (Αθήνα)',
    }
    const title = titles[ option ];

    const levelRepr: ObjectType = { 0: 'χαμηλότερη', 1: 'χαμηλή', 2: 'μεσαία', 3:'υψηλή', 4: 'υψηλότερη' };
    const pieLabel = `Αξιολόγηση: ${cardHandler.cluster+1} (${levelRepr[ cardHandler.cluster ]})`;

    return (
        <div className="Card">
            <div className="Title">{ title }</div>

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
