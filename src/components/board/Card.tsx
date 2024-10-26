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

    const dataParser = new CardDataParserFactory( option, result ).parser; 
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

const AthensTemperatureCard = ( { option, result }: PropsType ) => {

    const dataParser = new CardDataParserFactory( option, result ).parser; 
    const layoutHandler = new CardLayoutHandlerFactory( option, dataParser ).handler;

    const keys: string[] = layoutHandler.lineChartHandler.yValueHandlers.map( h => h.key );
    const json: ObjectType = dataParser.toJSON();
    const measurements: number[] = keys.map( k => json[ k ] );
    const units: UnitType[] = layoutHandler.lineChartHandler.yValueHandlers.map( h => h.unit );
    const historicAvg: ObjectType = json.historicAvg;
    console.log( 'json',json)

    const evaluation: string = layoutHandler.pieChartHandler.evaluation[ dataParser.cluster ];
    const pieLabel = `Evaluation: ${dataParser.cluster+1} (${evaluation})`;

    return (
        <div className="Card">
            <div className="Title">{ layoutHandler.title }</div>

            <div className="Info">
                <div>Last update: { dataParser.date } </div>
                <div>
                    <table>
                    <tbody>
                        <tr>
                            <th></th>
                            <th className='numeric'>min <Unit unit={ units[ 0 ] }/></th>
                            <th className='numeric'>mean <Unit unit={ units[ 0 ] }/></th>
                            <th className='numeric'>max <Unit unit={ units[ 0 ] }/></th>
                        </tr>
                        <tr>
                            <td>Measurement</td>
                            <td className='numeric'>{ measurements[ 0 ] }</td>
                            <td className='numeric'>{ measurements[ 1 ] }</td>
                            <td className='numeric'>{ measurements[ 2 ] }</td>
                        </tr>
                        <tr>
                            <td>Historic avg</td>
                            <td className='numeric'>{ Math.round( historicAvg.min * 10 ) / 10 }</td>
                            <td className='numeric'>{ Math.round( historicAvg.mean * 10 ) / 10 }</td>
                            <td className='numeric'>{ Math.round( historicAvg.max * 10 ) / 10 }</td>
                        </tr>
                        <tr>
                            <td>Difference</td>
                            <td className='numeric'>{ Math.round( ( measurements[ 0 ] - historicAvg.min ) * 10 ) / 10 }</td>
                            <td className='numeric'>{ Math.round( ( measurements[ 1 ] - historicAvg.mean ) * 10 ) / 10 }</td>
                            <td className='numeric'>{ Math.round( ( measurements[ 2 ] - historicAvg.max ) * 10 ) / 10 }</td>
                        </tr>
                    </tbody>
                    </table>
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

export { Card, AthensTemperatureCard };
