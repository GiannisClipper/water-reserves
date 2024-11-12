import DataParser from "@/logic/DataParser";
import { 
    DateValueHandler, 
    PrecipitationValueHandler, ProductionValueHandler, SavingsValueHandler,
    MaxTemperatureValueHandler, MeanTemperatureValueHandler, MinTemperatureValueHandler, 
} from "../../ValueHandler/status";

import { ChartLayoutHandler, EvaluationChartLayoutHandler } from "../chart/_abstract";

import {
    ROSE, PINK, FUCHSIA, PURPLE, VIOLET,
    INDIGO, BLUE, SKY, CYAN, TEAL, EMERALD, 
    GREEN, LIME, YELLOW, AMBER, ORANGE, RED,
    STONE, NEUTRAL, ZINC, GRAY, SLATE
} from '@/helpers/colors';

import type { EvaluationType, ObjectType } from "@/types";

import { XTicksCalculator } from "@/logic/LayoutHandler/chart/_abstract/xTicks";
import { MinimalYTicksCalculator } from "@/logic/LayoutHandler/chart/_abstract/yTicks";
import { CardDataParser } from "@/logic/DataParser/CardDataParser";

const evaluation4: EvaluationType = { 0: 'lower', 1: 'low', 2:'high', 3: 'higher' };
const evaluation5: EvaluationType = { 0: 'lower', 1: 'low', 2: 'mid', 3:'high', 4: 'higher' };
const evaluation6: EvaluationType = { 0: 'lower', 1: 'low', 2: 'mid-low', 3: 'mid-high', 4:'high', 5: 'higher' };

interface CardLayoutHandlerType {
    title: string;
    lineChartHandler: ChartLayoutHandler;
    pieChartHandler: EvaluationChartLayoutHandler;
}

class CardLayoutHandler {

    title: string;
    lineChartHandler: ChartLayoutHandler;
    pieChartHandler: EvaluationChartLayoutHandler;

    constructor( { title, lineChartHandler, pieChartHandler }: CardLayoutHandlerType ) {
        this.title = title;
        this.lineChartHandler = lineChartHandler;
        this.pieChartHandler = pieChartHandler;
    }
}

class SavingsCardLayoutHandler extends CardLayoutHandler {

    constructor( dataParser: CardDataParser ) {
        super( { 
            title: 'Water reserves',

            lineChartHandler: new ChartLayoutHandler( { 
                xValueHandler: new DateValueHandler(), 
                yValueHandlers: [ new SavingsValueHandler() ],
                dataBox: { data: dataParser.recentEntries },
                XTicksCalculator,
                YTicksCalculator: MinimalYTicksCalculator,
            } ),

            pieChartHandler: new EvaluationChartLayoutHandler( {
                evaluation: evaluation6,
                color: SKY,
            } ),
        } );
    }
}

class ProductionCardLayoutHandler extends CardLayoutHandler {

    constructor( dataParser: CardDataParser ) {
        super( { 
            title: 'Drinking water production',

            lineChartHandler: new ChartLayoutHandler( { 
                xValueHandler: new DateValueHandler(), 
                yValueHandlers: [ new ProductionValueHandler() ],
                dataBox: { data: dataParser.recentEntries },
                XTicksCalculator,
                YTicksCalculator: MinimalYTicksCalculator,
            } ),

            pieChartHandler: new EvaluationChartLayoutHandler( {
                evaluation: evaluation4,
                color: PINK,
            } ),
        } );
    }
}

class PrecipitationCardLayoutHandler extends CardLayoutHandler {

    constructor( dataParser: CardDataParser ) {
        super( { 
            title: 'Precipitation measurements',

            lineChartHandler: new ChartLayoutHandler( { 
                xValueHandler: new DateValueHandler(), 
                yValueHandlers: [ new PrecipitationValueHandler() ],
                dataBox: { data: dataParser.recentEntries },
                XTicksCalculator,
                YTicksCalculator: MinimalYTicksCalculator,
            } ),

            pieChartHandler: new EvaluationChartLayoutHandler( {
                evaluation: evaluation5,
                color: TEAL,
            } ),
        } );
    }
}

class AthensTemperatureCardLayoutHandler extends CardLayoutHandler {

    constructor( dataParser: CardDataParser ) {
        super( { 
            title: 'Temperature in Athens',

            lineChartHandler: new ChartLayoutHandler( { 
                xValueHandler: new DateValueHandler(), 
                yValueHandlers: [ 
                    new MinTemperatureValueHandler(),
                    new MeanTemperatureValueHandler(),
                    new MaxTemperatureValueHandler(),
                ],
                dataBox: { data: dataParser.recentEntries },
                XTicksCalculator,
                YTicksCalculator: MinimalYTicksCalculator,
            } ),

            pieChartHandler: new EvaluationChartLayoutHandler( {
                evaluation: evaluation6,
                color: YELLOW,
            } ),
        } );
    }
}

class CardLayoutHandlerFactory {

    handler: CardLayoutHandler;

    constructor( option: string, dataParser: CardDataParser ) {
    
        switch ( option ) {

            case 'savings': {
                this.handler = new SavingsCardLayoutHandler( dataParser );
                break;
            }

            case 'production': {
                this.handler = new ProductionCardLayoutHandler( dataParser );
                break;
            }

            case 'precipitation': {
                this.handler = new PrecipitationCardLayoutHandler( dataParser );
                break;
            }

            case 'temperature': {
                this.handler = new AthensTemperatureCardLayoutHandler( dataParser );
                break;
            }

            default:
                throw `Invalid option (${option}) used in CardLayoutHandlerFactory`;
        }
    }
}

export default CardLayoutHandlerFactory;