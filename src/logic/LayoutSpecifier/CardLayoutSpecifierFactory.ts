import { LayoutSpecifier, ChartLayoutSpecifier } from ".";

import { SearchParamsType, SavingsSearchParamsType } from "@/types/searchParams";
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

class LayoutSpecifierFactory {

    layoutSpecifier: LayoutSpecifier;

    constructor( option: string ) {
    
        switch ( option ) {

            case 'savings': {

                const title: string = 'Water reserves';
                const unit: UnitType = 'm3';
                const colors: ObjectType[] = [ SKY ];
                this.layoutSpecifier = new ChartLayoutSpecifier( { title, unit, colors } );
                break;
            }

            case 'production': {

                const title: string = 'Drinking water production';
                const unit: UnitType = 'm3';
                const colors: ObjectType[] = [ PINK ];
                this.layoutSpecifier = new ChartLayoutSpecifier( { title, unit, colors } );
                break;
            }

            case 'precipitation': {

                
                const title: string = 'Precipitation';
                const unit: UnitType = 'mm';
                const colors: ObjectType[] = [ TEAL ];
                this.layoutSpecifier = new ChartLayoutSpecifier( { title, unit, colors } );
                break;
            }

            case 'temperature': {
        
                const title: string = 'Mean temperature in Athens';
                const unit: UnitType = 'oC';
                const colors: ObjectType[] = [ CYAN, YELLOW, ORANGE ];
                this.layoutSpecifier = new ChartLayoutSpecifier( { title, unit, colors } );
                break;
            }

            default:
                throw `Invalid option (${option}) used in LayoutSpecifierFactory`;
        }
    }
}

export default LayoutSpecifierFactory;