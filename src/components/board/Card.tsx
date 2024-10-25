"use client"

import { CardLineChart, CardPieChart } from "./Charts";
import { Unit } from "@/components/Unit";

import CardDataHandlerFactory from "@/logic/DataHandler/CardDataHandler";
import { withCommas } from "@/helpers/numbers";

import type { ObjectType, UnitType } from "@/types";
import CardLayoutHandlerFactory from "@/logic/LayoutHandler/card";

type PropsType = { 
    option: string
    result: ObjectType
};

const Card = ( { option, result }: PropsType ) => {

    const dataHandler = new CardDataHandlerFactory( option, result ).handler; 
    const layoutHandler = new CardLayoutHandlerFactory( option, dataHandler ).handler;

    const key: string = layoutHandler.lineChartHandler.yValueHandlers[ 0 ].key;
    const measurement: number = dataHandler.toJSON()[ key ];
    const unit: UnitType = layoutHandler.lineChartHandler.yValueHandlers[ 0 ].unit;

    const evaluation: string = layoutHandler.pieChartHandler.evaluation[ dataHandler.cluster ];
    const pieLabel = `Evaluation: ${dataHandler.cluster+1} (${evaluation})`;

    return (
        <div className="Card">
            <div className="Title">{ layoutHandler.title }</div>

            <div className="Info">
                <div>Last update: { dataHandler.date } </div>
                <div>
                    Measurement: { withCommas( measurement ) } <Unit unit={ unit }/>
                </div>
            </div>

            <CardLineChart 
                data={ dataHandler.recentEntries }
                label={ `Recent measurements: ${dataHandler.interval}` }
                layoutHandler={ layoutHandler.lineChartHandler }
            />

            <CardPieChart 
                cluster={ dataHandler.cluster } 
                label={ pieLabel }
                layoutHandler={ layoutHandler.pieChartHandler }
            />
        </div>
    );
}

export { Card };
