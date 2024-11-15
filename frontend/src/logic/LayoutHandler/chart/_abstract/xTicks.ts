import { ObjectType } from "@/types";

interface XTicksCalculatorType {
    xTicks: string[];
}

class XTicksCalculator implements XTicksCalculatorType {

    xTicks: string[];

    constructor( xValues: string[] ) {    
        this.xTicks = xValues;
        return
    }
}

class TemporalXTicksCalculator implements XTicksCalculatorType {

    xTicks: string[];

    constructor( xValues: string[] ) {
    
        if ( xValues.length === 0 ) {
            this.xTicks = [];
            return
        }
    
        switch ( xValues[ 0 ].length ) {
    
            case 10:
                // reduce days to months
                if ( xValues.length > 62 ) {
                    xValues = xValues.filter( ( v: string ) => v.substring( 8, 10 ) === '01' );
    
                    // reduce furthermore to years
                    if ( xValues.length > 24 ) {
                            xValues = xValues.filter( ( v: string ) => v.substring( 5, 7 ) === '01' );
                    }
                }
    
            case 7:
                // reduce months to years
                if ( xValues.length > 24 ) {
                    xValues = xValues.filter( ( v: string ) => v.substring( 5, 7 ) === '01' );
                }
        }

        this.xTicks = xValues;
    }
}

export { XTicksCalculator, TemporalXTicksCalculator };