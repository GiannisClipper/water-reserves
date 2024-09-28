"use client"

// import dynamic from "next/dynamic";
// const { Card } = dynamic( import( "./Card" ), { ssr: false } );

import { CardLineChart, CardPieChart } from "./Charts";
import { Unit } from "@/components/page/chart/tooltips";

import { CardHandlerFactory } from "@/logic/CardHandler";
import { withCommas } from "@/helpers/numbers";

import type { ObjectType } from "@/types";
import { MetadataHandlerFactory } from "@/logic/MetadataHandler";

type PropsType = { 
    option: string
    result: ObjectType
};

const Card = ( { option, result }: PropsType ) => {

    const metadataHandler = new MetadataHandlerFactory( option, {} ).metadataHandler;
    const cardHandler = new CardHandlerFactory( option, result ).cardHandler;

    const titles: ObjectType = { 
        'savings': 'Αποθέματα νερού',
        'production': 'Παραγωγή πόσιμου νερού',
        'precipitation': 'Μετρήσεις υετού',
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
                    Ποσότητα: { withCommas(cardHandler.value) } { cardHandler.unit }
                </div>
            </div>

            <CardLineChart 
                data={ cardHandler.recentEntries }
                label={ `Πρόσφατες μετρήσεις: ${cardHandler.interval}` }
                color={ metadataHandler._colors[ 0 ] }
            />

            <CardPieChart 
                cluster={ cardHandler.cluster } 
                label={ pieLabel }
                color={ metadataHandler._colors[ 0 ] }
            />
        </div>
    );
}

export { Card };
