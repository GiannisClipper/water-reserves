"use client"

import { CardLineChart, CardPieChart } from "./Charts";
import { Unit } from "@/components/Unit";

import CardDataParserFactory from "@/logic/DataParser/CardDataParser";
import { withCommas } from "@/helpers/numbers";

import type { ObjectType, UnitType } from "@/types";
import CardLayoutHandlerFactory from "@/logic/LayoutHandler/card";

type PropsType = { 
    option: string
    result: ObjectType
};

const Card = ( { option, result }: PropsType ) => {

    const dataParser = new CardDataParserFactory( option, result ).handler; 
    const layoutHandler = new CardLayoutHandlerFactory( option, dataParser ).handler;

    const key: string = layoutHandler.lineChartHandler.yValueHandlers[ 0 ].key;
    const measurement: number = dataParser.toJSON()[ key ];
    const unit: UnitType = layoutHandler.lineChartHandler.yValueHandlers[ 0 ].unit;

    const evaluation: string = layoutHandler.pieChartHandler.evaluation[ dataParser.cluster ];
    const pieLabel = `Evaluation: ${dataParser.cluster+1} (${evaluation})`;

    return (
        <div className="Card">
            <div className="Title">{ layoutHandler.title }</div>

            <div className="Info">
                <div>Last update: { dataParser.date } </div>
                <div>
                    Measurement: { withCommas( measurement ) } <Unit unit={ unit }/>
                </div>
            </div>

            <CardLineChart 
                data={ dataParser.recentEntries }
                label={ `Recent measurements: ${dataParser.interval}` }
                layoutHandler={ layoutHandler.lineChartHandler }
            />

            <CardPieChart 
                cluster={ dataParser.cluster } 
                label={ pieLabel }
                layoutHandler={ layoutHandler.pieChartHandler }
            />
        </div>
    );
}

export { Card };
