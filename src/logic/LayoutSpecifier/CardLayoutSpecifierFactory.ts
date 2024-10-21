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

class LayoutSpecifierFactory {

    layoutSpecifier: LayoutSpecifier;

    constructor( option: string ) {
    
        switch ( option ) {

            case 'savings': {

                const title: string = 'Water reserves';
                const unit: UnitType = 'm3';
                const colors: ObjectType[] = [ SKY ];
                const xKeys: string[] = [ 'date' ]; 
                const yKeys: string[] = [ 'quantity' ]; 
                this.layoutSpecifier = new ChartLayoutSpecifier( { title, unit, colors, xKeys, yKeys } );
                break;
            }

            case 'production': {

                const title: string = 'Drinking water production';
                const unit: UnitType = 'm3';
                const colors: ObjectType[] = [ PINK ];
                const xKeys: string[] = [ 'date' ]; 
                const yKeys: string[] = [ 'quantity' ]; 
                this.layoutSpecifier = new ChartLayoutSpecifier( { title, unit, colors, xKeys, yKeys } );
                break;
            }

            case 'precipitation': {

                
                const title: string = 'Precipitation';
                const unit: UnitType = 'mm';
                const colors: ObjectType[] = [ TEAL ];
                const xKeys: string[] = [ 'date' ]; 
                const yKeys: string[] = [ 'precipitation_sum' ]; 
                this.layoutSpecifier = new ChartLayoutSpecifier( { title, unit, colors, xKeys, yKeys } );
                break;
            }

            case 'temperature': {
        
                const title: string = 'Mean temperature in Athens';
                const unit: UnitType = 'oC';
                const colors: ObjectType[] = [ CYAN, YELLOW, ORANGE ];
                const xKeys: string[] = [ 'date' ]; 
                const yKeys: string[] = [ 'temperature_2m_min', 'temperature_2m_mean', 'temperature_2m_max' ]; 
                this.layoutSpecifier = new ChartLayoutSpecifier( { title, unit, colors, xKeys, yKeys } );
                break;
            }

            default:
                throw `Invalid option (${option}) used in LayoutSpecifierFactory`;
        }
    }
}

export default LayoutSpecifierFactory;