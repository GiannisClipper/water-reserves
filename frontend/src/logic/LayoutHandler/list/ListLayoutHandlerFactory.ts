import { ListLayoutHandler } from "./_abstract";
import { SavingsListLayoutHandlerFactory } from "./savings";
import { ProductionListLayoutHandlerFactory } from "./production";
import { PrecipitationListLayoutHandlerFactory } from "./precipitation";
import { TemperatureListLayoutHandlerFactory } from "./temperature";
import { SavingsProductionListLayoutHandlerFactory } from "./savings-production";
import { SavingsPrecipitationListLayoutHandlerFactory } from "./savings-precipitation";
import { InterruptionsListLayoutHandlerFactory } from "./interruptions";

import type { SearchParamsType } from "@/types/searchParams";
import type { ObjectType } from "@/types";

class ListLayoutHandlerFactory {

    handler: ListLayoutHandler;

    constructor( option: string, searchParams: SearchParamsType, dataBox: ObjectType ) {
    
        switch ( option ) {

            case 'savings': {
                this.handler = new SavingsListLayoutHandlerFactory( searchParams, dataBox ).handler;
                break;
            }

            case 'production': {
                this.handler = new ProductionListLayoutHandlerFactory( searchParams, dataBox ).handler;
                break;
            }

            case 'precipitation': {
                this.handler = new PrecipitationListLayoutHandlerFactory( searchParams, dataBox ).handler;
                break;
            }

            case 'temperature': {
                this.handler = new TemperatureListLayoutHandlerFactory( searchParams, dataBox ).handler;
                break;
            }

            case 'savings-production': {
                this.handler = new SavingsProductionListLayoutHandlerFactory( searchParams, dataBox ).handler;
                break;
            }

            case 'savings-precipitation': {
                this.handler = new SavingsPrecipitationListLayoutHandlerFactory( searchParams, dataBox ).handler;
                break;
            }

            case 'interruptions': {
                this.handler = new InterruptionsListLayoutHandlerFactory( searchParams, dataBox ).handler;
                break;
            }

            default:
                throw `Invalid option (${option}) used in ListLayoutHandlerFactory`;
        }
    }
}

export default ListLayoutHandlerFactory;