import { ChartLayoutHandler } from "./_abstract";
import { SavingsChartLayoutHandlerFactory } from "./savings";
import { ProductionChartLayoutHandlerFactory } from "./production";
import { PrecipitationChartLayoutHandlerFactory } from "./precipitation";
import { TemperatureChartLayoutHandlerFactory } from "./temperature";
import { SavingsProductionChartLayoutHandlerFactory } from "./savings-production";
import { SavingsPrecipitationChartLayoutHandlerFactory } from "./savings-precipitation";
import { InterruptionsChartLayoutHandlerFactory } from "./interruptions";

import DataParser from "@/logic/DataParser";

import type { SearchParamsType } from "@/types/searchParams";

class ChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( option: string, searchParams: SearchParamsType, dataParser: DataParser ) {
    
        switch ( option ) {

            case 'savings': {
                this.handler = new SavingsChartLayoutHandlerFactory( searchParams, dataParser ).handler;
                break;
            }

            case 'production': {
                this.handler = new ProductionChartLayoutHandlerFactory( searchParams, dataParser ).handler;
                break;
            }

            case 'precipitation': {
                this.handler = new PrecipitationChartLayoutHandlerFactory( searchParams, dataParser ).handler;
                break;
            }

            case 'temperature': {
                this.handler = new TemperatureChartLayoutHandlerFactory( searchParams, dataParser ).handler;
                break;
            }

            case 'savings-production': {
                this.handler = new SavingsProductionChartLayoutHandlerFactory( searchParams, dataParser ).handler;
                break;
            }

            case 'savings-precipitation': {
                this.handler = new SavingsPrecipitationChartLayoutHandlerFactory( searchParams, dataParser ).handler;
                break;
            }

            case 'interruptions': {
                this.handler = new InterruptionsChartLayoutHandlerFactory( searchParams, dataParser ).handler;
                break;
            }

            default:
                throw `Invalid option (${option}) used in StackChartLayoutHandlerFactory`;
        }
    }
}

export default ChartLayoutHandlerFactory;