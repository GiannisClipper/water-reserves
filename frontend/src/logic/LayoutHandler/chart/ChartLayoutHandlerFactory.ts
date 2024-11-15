import { ChartLayoutHandler } from "./_abstract";
import { SavingsChartLayoutHandlerFactory } from "./savings";
import { ProductionChartLayoutHandlerFactory } from "./production";
import { PrecipitationChartLayoutHandlerFactory } from "./precipitation";
import { TemperatureChartLayoutHandlerFactory } from "./temperature";
import { SavingsProductionChartLayoutHandlerFactory } from "./savings-production";
import { SavingsPrecipitationChartLayoutHandlerFactory } from "./savings-precipitation";
import { InterruptionsChartLayoutHandlerFactory } from "./interruptions";

import type { SearchParamsType } from "@/types/searchParams";
import type { ObjectType } from "@/types";

class ChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( option: string, searchParams: SearchParamsType, dataBox: ObjectType ) {
    
        switch ( option ) {

            case 'savings': {
                this.handler = new SavingsChartLayoutHandlerFactory( searchParams, dataBox ).handler;
                break;
            }

            case 'production': {
                this.handler = new ProductionChartLayoutHandlerFactory( searchParams, dataBox ).handler;
                break;
            }

            case 'precipitation': {
                this.handler = new PrecipitationChartLayoutHandlerFactory( searchParams, dataBox ).handler;
                break;
            }

            case 'temperature': {
                this.handler = new TemperatureChartLayoutHandlerFactory( searchParams, dataBox ).handler;
                break;
            }

            case 'savings-production': {
                this.handler = new SavingsProductionChartLayoutHandlerFactory( searchParams, dataBox ).handler;
                break;
            }

            case 'savings-precipitation': {
                this.handler = new SavingsPrecipitationChartLayoutHandlerFactory( searchParams, dataBox ).handler;
                break;
            }

            case 'interruptions': {
                this.handler = new InterruptionsChartLayoutHandlerFactory( searchParams, dataBox ).handler;
                break;
            }

            default:
                throw `Invalid option (${option}) used in ChartLayoutHandlerFactory`;
        }
    }
}

export default ChartLayoutHandlerFactory;