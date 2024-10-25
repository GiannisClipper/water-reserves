import { ChartLayoutHandler } from ".";
import { SavingsChartLayoutHandlerFactory } from "./savings";
import { ProductionChartLayoutHandlerFactory } from "./production";
import { PrecipitationChartLayoutHandlerFactory } from "./precipitation";
import { TemperatureChartLayoutHandlerFactory } from "./temperature";
import { SavingsProductionChartLayoutHandlerFactory } from "./savings-production";
import { SavingsPrecipitationChartLayoutHandlerFactory } from "./savings-precipitation";
import { InterruptionsChartLayoutHandlerFactory } from "./interruptions";

import DataHandler from "@/logic/DataHandler";

import type { SearchParamsType } from "@/types/searchParams";

class ChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( option: string, searchParams: SearchParamsType, dataHandler: DataHandler ) {
    
        switch ( option ) {

            case 'savings': {
                this.handler = new SavingsChartLayoutHandlerFactory( searchParams, dataHandler ).handler;
                break;
            }

            case 'production': {
                this.handler = new ProductionChartLayoutHandlerFactory( searchParams, dataHandler ).handler;
                break;
            }

            case 'precipitation': {
                this.handler = new PrecipitationChartLayoutHandlerFactory( searchParams, dataHandler ).handler;
                break;
            }

            case 'temperature': {
                this.handler = new TemperatureChartLayoutHandlerFactory( searchParams, dataHandler ).handler;
                break;
            }

            case 'savings-production': {
                this.handler = new SavingsProductionChartLayoutHandlerFactory( searchParams, dataHandler ).handler;
                break;
            }

            case 'savings-precipitation': {
                this.handler = new SavingsPrecipitationChartLayoutHandlerFactory( searchParams, dataHandler ).handler;
                break;
            }

            case 'interruptions': {
                this.handler = new InterruptionsChartLayoutHandlerFactory( searchParams, dataHandler ).handler;
                break;
            }

            default:
                throw `Invalid option (${option}) used in StackChartLayoutHandlerFactory`;
        }
    }
}

export default ChartLayoutHandlerFactory;