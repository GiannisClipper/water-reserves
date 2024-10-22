import { LayoutSpecifier, ChartLayoutSpecifier } from ".";

import { DateValueHandler } from "../ValueHandler/status";
import { SavingsValueHandler } from "../ValueHandler/status";
import { ProductionValueHandler } from "../ValueHandler/status";
import { PrecipitationValueHandler } from "../ValueHandler/status";
import { MinTemperatureValueHandler } from "../ValueHandler/status";
import { MeanTemperatureValueHandler } from "../ValueHandler/status";
import { MaxTemperatureValueHandler } from "../ValueHandler/status";

class LayoutSpecifierFactory {

    lineChartLayoutSpecifier: ChartLayoutSpecifier;

    constructor( option: string ) {
    
        switch ( option ) {

            case 'savings': {

                this.lineChartLayoutSpecifier = new ChartLayoutSpecifier( { 
                    title: 'Water reserves', 
                    xValueHandler: new DateValueHandler(), 
                    yValueHandlers: [ new SavingsValueHandler() ],
                } );
                break;
            }

            case 'production': {

                this.lineChartLayoutSpecifier = new ChartLayoutSpecifier( { 
                    title: 'Drinking water production', 
                    xValueHandler: new DateValueHandler(), 
                    yValueHandlers: [ new ProductionValueHandler() ],
                } );
                break;
            }

            case 'precipitation': {

                this.lineChartLayoutSpecifier = new ChartLayoutSpecifier( { 
                    title: 'Precipitation', 
                    xValueHandler: new DateValueHandler(), 
                    yValueHandlers: [ new PrecipitationValueHandler() ],
                } );
                break;
            }

            case 'temperature': {
        

                this.lineChartLayoutSpecifier = new ChartLayoutSpecifier( { 
                    title: 'Mean temperature in Athens', 
                    xValueHandler: new DateValueHandler(), 
                    yValueHandlers: [ 
                        new MinTemperatureValueHandler(),
                        new MeanTemperatureValueHandler(),
                        new MaxTemperatureValueHandler()
                    ],
                } );
                break;
            }

            default:
                throw `Invalid option (${option}) used in LayoutSpecifierFactory`;
        }
    }
}

export default LayoutSpecifierFactory;