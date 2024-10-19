import { LayoutSpecifier, ChartLayoutSpecifier } from ".";

import { SearchParamsType } from "@/types/searchParams";
import { ParamValues } from "../ParamValues";

import {
    ROSE, PINK, FUCHSIA, PURPLE, VIOLET,
    INDIGO, BLUE, SKY, CYAN, TEAL, EMERALD, 
    GREEN, LIME, YELLOW, AMBER, ORANGE, RED, 
    STONE, NEUTRAL, ZINC, GRAY, SLATE
} from '@/helpers/colors';

import type { ObjectType, UnitType } from "@/types";

interface LayoutSpecifierType {
    title?: string
    unit?: UnitType
    colors?: ObjectType[]
}

const timeRepr: ObjectType = {
    '': 'Time density (date)',
    'date': 'Time density (date)',
    'month': 'Time density (month)',
    'year': 'Time density (year)',
    'custom_year': 'Time density (custom_year)',
};

const valueRepr: ObjectType = {
    '': 'Daily quantity',
    avg: 'Mean daily quantity',
    sum: 'Sum quantity',
};

class LayoutSpecifierFactory {

    layoutSpecifier: LayoutSpecifier;

    constructor( option: string, searchParams: SearchParamsType ) {
    
        const params = new ParamValues( searchParams ).toJSON();
        const { timeAggregation, valueAggregation } = params;

        switch ( option ) {

            case 'savings': {

                const title: string = 'Water reserves ' + ( 
                    valueAggregation 
                        ? '(all reservoirs)'
                        : '(per reservoir)'
                );
                const unit: UnitType = 'm3';
                const colors: ObjectType[] = [ SKY ];
                const xLabel: string = timeRepr[ timeAggregation ];
                const yLabel: string = valueRepr[ valueAggregation ] + ' (cubic meters)';
                this.layoutSpecifier = new ChartLayoutSpecifier( { title, unit, colors, xLabel, yLabel } );
                break;
            }

            case 'production': {

                const title: string = 'Drinking water production ' + ( 
                    valueAggregation 
                        ? '(all plants)'
                        : '(per plant)'
                );
                const unit: UnitType = 'm3';
                const colors: ObjectType[] = [ PINK ];
                const xLabel: string = timeRepr[ timeAggregation ];
                const yLabel: string = valueRepr[ valueAggregation ] + ' (cubic meters)';
                this.layoutSpecifier = new ChartLayoutSpecifier( { title, unit, colors, xLabel, yLabel } );
                break;
            }

            case 'precipitation': {

                const title: string = 'Precipitation ' + ( 
                    valueAggregation 
                        ? '(all locations)'
                        : '(per location)'
                );
                const unit: UnitType = 'mm';
                const colors: ObjectType[] = [ TEAL ];
                const xLabel: string = timeRepr[ timeAggregation ];
                const yLabel: string = valueRepr[ valueAggregation ] + ' (mm)';
                this.layoutSpecifier = new ChartLayoutSpecifier( { title, unit, colors, xLabel, yLabel } );
                break;
            }

            case 'temperature': {
        
                const title: string = ! timeAggregation
                    ? 'Daily temperatures in Athens'
                    : 'Mean daily temperatures in Athens';

                const unit: UnitType = 'oC';
                const colors: ObjectType[] = [ CYAN, YELLOW, ORANGE ];
                const xLabel: string = timeRepr[ timeAggregation ];
                const yLabel: string = 'Celcius degrees';
                this.layoutSpecifier = new ChartLayoutSpecifier( { title, unit, colors, xLabel, yLabel } );
                break;
            }

            case 'interruptions': {
        
                const title: string = 'Water supply interruptions';

                const unit: UnitType = 'oC';
                const colors: ObjectType[] = [ RED ];
                let xLabel: string = timeRepr[ timeAggregation ];
                if ( timeAggregation === 'alltime' ) {
                    xLabel = 'Municipalities';
                }
                const yLabel: string = 'Events';
                this.layoutSpecifier = new ChartLayoutSpecifier( { title, unit, colors, xLabel, yLabel } );
                break;
            }

            case 'savings-production': {
         
                const title: string = 'Water reserves & drinking water production';
                const unit: UnitType = '%';
                const colors: ObjectType[] = [ SKY, PINK ];
                const xLabel: string = timeRepr[ timeAggregation ];
                const yLabel: string = valueRepr[ valueAggregation ] + ' (change %)';
                this.layoutSpecifier = new ChartLayoutSpecifier( { title, unit, colors, xLabel, yLabel } );
                break;
            }

            case 'savings-precipitation': {
         
                const title: string = 'Water reserves & precipitation';
                const unit: UnitType = '%';
                const colors: ObjectType[] = [ SKY, TEAL ];
                const xLabel: string = timeRepr[ timeAggregation ];
                const yLabel: string = valueRepr[ valueAggregation ] + ' (change %)';
                this.layoutSpecifier = new ChartLayoutSpecifier( { title, unit, colors, xLabel, yLabel } );
                break;
            }

            default:
                throw `Invalid option (${option}) used in LayoutSpecifierFactory`;
        }
    }
}

export default LayoutSpecifierFactory;