import { ListLayoutHandler } from "./_abstract";
import { SavingsListLayoutHandlerFactory } from "./savings";
// import { ProductionListLayoutHandlerFactory } from "./production";
// import { PrecipitationListLayoutHandlerFactory } from "./precipitation";
// import { TemperatureListLayoutHandlerFactory } from "./temperature";
// import { SavingsProductionListLayoutHandlerFactory } from "./savings-production";
// import { SavingsPrecipitationListLayoutHandlerFactory } from "./savings-precipitation";
// import { InterruptionsListLayoutHandlerFactory } from "./interruptions";

import DataParser from "@/logic/DataParser";

import type { SearchParamsType } from "@/types/searchParams";

class ListLayoutHandlerFactory {

    handler: ListLayoutHandler;

    constructor( option: string, searchParams: SearchParamsType, dataParser: DataParser ) {
    
        switch ( option ) {

            case 'savings': {
                this.handler = new SavingsListLayoutHandlerFactory( searchParams, dataParser ).handler;
                break;
            }

            // case 'production': {
            //     this.handler = new ProductionListLayoutHandlerFactory( searchParams, dataParser ).handler;
            //     break;
            // }

            // case 'precipitation': {
            //     this.handler = new PrecipitationListLayoutHandlerFactory( searchParams, dataParser ).handler;
            //     break;
            // }

            // case 'temperature': {
            //     this.handler = new TemperatureListLayoutHandlerFactory( searchParams, dataParser ).handler;
            //     break;
            // }

            // case 'savings-production': {
            //     this.handler = new SavingsProductionListLayoutHandlerFactory( searchParams, dataParser ).handler;
            //     break;
            // }

            // case 'savings-precipitation': {
            //     this.handler = new SavingsPrecipitationListLayoutHandlerFactory( searchParams, dataParser ).handler;
            //     break;
            // }

            // case 'interruptions': {
            //     this.handler = new InterruptionsListLayoutHandlerFactory( searchParams, dataParser ).handler;
            //     break;
            // }

            default:
                throw `Invalid option (${option}) used in ListLayoutHandlerFactory`;
        }
    }
}

export default ListLayoutHandlerFactory;