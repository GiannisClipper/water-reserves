import { DateValueHandler, MaxTemperatureValueHandler, MeanTemperatureValueHandler, MinTemperatureValueHandler, PrecipitationValueHandler, ProductionValueHandler, SavingsValueHandler } from "../ValueHandler/status";
import { EvaluationChartLayoutHandler, MinimalChartLayoutHandler } from "./ChartLayoutHandler";

import {
    ROSE, PINK, FUCHSIA, PURPLE, VIOLET,
    INDIGO, BLUE, SKY, CYAN, TEAL, EMERALD, 
    GREEN, LIME, YELLOW, AMBER, ORANGE, RED, 
    STONE, NEUTRAL, ZINC, GRAY, SLATE
} from '@/helpers/colors';

import type { EvaluationType } from "@/types";

const evaluation: EvaluationType = { 0: 'lower', 1: 'low', 2: 'mid', 3:'high', 4: 'higher' };

interface CardLayoutHandlerTpe {
    title: string;
    lineChartHandler: MinimalChartLayoutHandler;
    pieChartHandler: EvaluationChartLayoutHandler;
}

class CardLayoutHandler {

    title: string;
    lineChartHandler: MinimalChartLayoutHandler;
    pieChartHandler: EvaluationChartLayoutHandler;

    constructor( { title, lineChartHandler, pieChartHandler }: CardLayoutHandlerTpe ) {
        this.title = title;
        this.lineChartHandler = lineChartHandler;
        this.pieChartHandler = pieChartHandler;
    }
}

class SavingsCardLayoutHandler extends CardLayoutHandler {

    constructor() {
        super( { 
            title: 'Water reserves',

            lineChartHandler: new MinimalChartLayoutHandler( { 
                xValueHandler: new DateValueHandler(), 
                yValueHandlers: [ new SavingsValueHandler() ],
            } ),

            pieChartHandler: new EvaluationChartLayoutHandler( {
                evaluation,
                color: SKY,
            } ),
        } );
    }
}

class ProductionCardLayoutHandler extends CardLayoutHandler {

    constructor() {
        super( { 
            title: 'Drinking water production',

            lineChartHandler: new MinimalChartLayoutHandler( { 
                xValueHandler: new DateValueHandler(), 
                yValueHandlers: [ new ProductionValueHandler() ],
            } ),

            pieChartHandler: new EvaluationChartLayoutHandler( {
                evaluation,
                color: PINK,
            } ),
        } );
    }
}

class PrecipitationCardLayoutHandler extends CardLayoutHandler {

    constructor() {
        super( { 
            title: 'Precipitation measurements',

            lineChartHandler: new MinimalChartLayoutHandler( { 
                xValueHandler: new DateValueHandler(), 
                yValueHandlers: [ new PrecipitationValueHandler() ],
            } ),

            pieChartHandler: new EvaluationChartLayoutHandler( {
                evaluation,
                color: TEAL,
            } ),
        } );
    }
}

class TemperatureCardLayoutHandler extends CardLayoutHandler {

    constructor() {
        super( { 
            title: 'Temperatures in Athens',

            lineChartHandler: new MinimalChartLayoutHandler( { 
                xValueHandler: new DateValueHandler(), 
                yValueHandlers: [ 
                    new MinTemperatureValueHandler(),
                    new MeanTemperatureValueHandler(),
                    new MaxTemperatureValueHandler(),
                ],
            } ),

            pieChartHandler: new EvaluationChartLayoutHandler( {
                evaluation,
                color: YELLOW,
            } ),
        } );
    }
}

class CardLayoutHandlerFactory {

    handler: CardLayoutHandler;

    constructor( option: string ) {
    
        switch ( option ) {

            case 'savings': {
                this.handler = new SavingsCardLayoutHandler();
                break;
            }

            case 'production': {
                this.handler = new ProductionCardLayoutHandler();
                break;
            }

            case 'precipitation': {
                this.handler = new PrecipitationCardLayoutHandler();
                break;
            }

            case 'temperature': {
                this.handler = new TemperatureCardLayoutHandler();
                break;
            }

            default:
                throw `Invalid option (${option}) used in CardLayoutHandlerFactory`;
        }
    }
}

export default CardLayoutHandlerFactory;