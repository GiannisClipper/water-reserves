import { ChartLayoutHandler } from ".";
import { SavingsSingleChartLayoutHandler } from "./SavingsChartLayoutHandler";
import { ProductionSingleChartLayoutHandler } from "./ProductionChartLayoutHandler";
import { PrecipitationSingleChartLayoutHandler } from "./PrecipitationChartLayoutHandler";
import { TemperatureMultiChartLayoutHandler } from "./TemperatureChartLayoutHandler";
import { InterruptionsSingleChartLayoutHandlerFactory } from './InterruptionsChartLayoutHandler';
import { SavingsProductionMultiChartLayoutHandler } from "./SavingsProductionChartLayoutHandler";
import { SavingsPrecipitationMultiChartLayoutHandler } from "./SavingsPrecipitationChartLayoutHandler";
import { SavingsStackChartLayoutHandler } from "./SavingsChartLayoutHandler";
import { ProductionStackChartLayoutHandler } from "./ProductionChartLayoutHandler";
import { PrecipitationStackChartLayoutHandler } from "./PrecipitationChartLayoutHandler";

import type { SearchParamsType } from "@/types/searchParams";

class ChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( type: string, option: string, searchParams: SearchParamsType ) {
    
        switch ( type ) {

            case 'single': {
                this.handler = new SingleChartLayoutHandlerFactory( option, searchParams ).handler;
                break;
            }

            case 'single,spatial': {
                this.handler = new SingleChartLayoutHandlerFactory( option, searchParams ).handler;
                break;
            }

            case 'multi': {
                this.handler = new MultiChartLayoutHandlerFactory( option, searchParams ).handler;
                break;
            }

            case 'stack': {
                this.handler = new StackChartLayoutHandlerFactory( option, searchParams ).handler;
                break;
            }

            default:
                throw `Invalid type (${type}) used in ChartLayoutHandlerFactory`;
        }
    }
}

class SingleChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( option: string, searchParams: SearchParamsType ) {
    
        switch ( option ) {

            case 'savings': {
                this.handler = new SavingsSingleChartLayoutHandler( searchParams );
                break;
            }

            case 'production': {
                this.handler = new ProductionSingleChartLayoutHandler( searchParams );
                break;
            }

            case 'precipitation': {
                this.handler = new PrecipitationSingleChartLayoutHandler( searchParams );
                break;
            }

            case 'interruptions': {
                this.handler = new InterruptionsSingleChartLayoutHandlerFactory( searchParams ).handler;
                break;
            }

            default:
                throw `Invalid option (${option}) used in SingleChartLayoutHandlerFactory`;
        }
    }
}

class MultiChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( option: string, searchParams: SearchParamsType ) {
    
        switch ( option ) {

            case 'temperature': {
                this.handler = new TemperatureMultiChartLayoutHandler( searchParams );
                break;
            }

            case 'savings-production': {
                this.handler = new SavingsProductionMultiChartLayoutHandler( searchParams );
                break;
            }

            case 'savings-precipitation': {
                this.handler = new SavingsPrecipitationMultiChartLayoutHandler( searchParams );
                break;
            }

            default:
                throw `Invalid option (${option}) used in MultiChartLayoutHandlerFactory`;
        }
    }
}

class StackChartLayoutHandlerFactory {

    handler: ChartLayoutHandler;

    constructor( option: string, searchParams: SearchParamsType ) {
    
        switch ( option ) {

            case 'savings': {
                this.handler = new SavingsStackChartLayoutHandler( searchParams );
                break;
            }

            case 'production': {
                this.handler = new ProductionStackChartLayoutHandler( searchParams );
                break;
            }

            case 'precipitation': {
                this.handler = new PrecipitationStackChartLayoutHandler( searchParams );
                break;
            }

            default:
                throw `Invalid option (${option}) used in StackChartLayoutHandlerFactory`;
        }
    }
}

export { 
    ChartLayoutHandlerFactory,
    SingleChartLayoutHandlerFactory, 
    MultiChartLayoutHandlerFactory, 
};