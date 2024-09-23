import { ObjectType } from "@/types";

type LineType = 'linear' | 'monotone';

class ChartHandler {

    data: ObjectType[] = [];

    xTicks: string[] = [];
    yTicks: number[] = [];

    constructor( data: ObjectType[] ) {
        this.data = data;
        this.xTicks = this._calculateXTicks();
        this.yTicks = this._calculateYTicks();
    }

    private _calculateXTicks = (): string[] => {

        let values = this.data.map( ( row: { [ key: string ]: any } ) => row.time );
    
        if ( values.length === 0 ) {
            return values;
        }
    
        switch ( values[ 0 ].length ) {
    
            case 10:
                // reduce days to months
                if ( values.length > 62 ) {
                    values = values.filter( ( v: string ) => v.substring( 8, 10 ) === '01' );
    
                    // reduce furthermore to years
                    if ( values.length > 24 ) {
                            values = values.filter( ( v: string ) => v.substring( 5, 7 ) === '01' );
                    }
                }
    
            case 7:
                // reduce months to years
                if ( values.length > 24 ) {
                    values = values.filter( ( v: string ) => v.substring( 5, 7 ) === '01' );
                }
        }
        return values;
    }

    private _calculateYTicks = (): number[] => {

        const minYValues = this.data.map( ( row: ObjectType ) => {
            const { time, quantity, quantities } = row;
    
            // case of multiple quantities
            if ( quantities !== undefined ) {
                return Math.min( ...Object.values( quantities ).map( q => q.quantity ) );
            }
    
            // case of single quantity
            return quantity;
        } );
    
        const maxYValues = this.data.map( ( row: ObjectType ) => {
            const { time, quantity, total, quantities } = row;
    
            // case of multiple quantities including total (line chart)
            if ( total !== undefined ) {
                return total;
            }
    
            // case of multiple quantities without total (area, bar charts)
            if ( quantities !== undefined ) {
                return Math.max( ...Object.values( quantities ).map( q => q.quantity ) );
            }
    
            // case of single quantity
            return quantity;
        } );
    
        const minYValue: number = Math.min( ...minYValues ) * 0.90;
        const maxYValue: number = Math.max( ...maxYValues ) * 1.05;
        const diff: number = ( maxYValue - minYValue );
        // console.log( 'minYValue, maxYValue, diff', minYValue, maxYValue, diff )
        // for example: 0 1278834027 1278834027
    
        let log: number = Math.log10( diff );
        const logDecimals: number = log - Math.trunc( log );
        // console.log( 'log, logDecimals', log, logDecimals ) 
        // for example: 9.10681418338768 0.10681418338768012
    
        log = Math.trunc( log ) - ( logDecimals * 100000 < 69897 ? 1 : 0 );
        log = log >= 1 ? log : 1;
        // console.log( 'log', log ) 
        // for example: 8
    
        let baseUnit: number = Math.pow( 10, log );
        let times = Math.ceil( Math.ceil( diff / baseUnit ) / 10 );
        times = Math.ceil( times / 2.5 ) * 2.5 // possible values: 2.5, 5, 7.5, 10
        // console.log( 'baseUnit, times', baseUnit, times ) 
        // for example: 100000000 2.5
    
        baseUnit *= times;
    
        let value = Math.floor( minYValue / baseUnit ) * baseUnit;
        const result = [ value ];
        while ( value <= maxYValue ) {
            value += baseUnit;
            result.push( value );
        }
        return result;    
    }

    getData = (): ObjectType[] => {
        return this.data;
    }

    getXTicks = (): string[] => {
        return this.xTicks;
    }

    getYTicks = (): number[] => {
        return this.yTicks;
    }

    minYTick = (): number => this.yTicks.length ? this.yTicks[ 0 ] : 0;

    maxYTick = (): number => this.yTicks.length ? this.yTicks[ this.yTicks.length - 1 ] : 0;

    getLineType = (): LineType => 
        this.xTicks.length && this.xTicks[ 0 ].length === 10 
            ? 'linear' // in case of full dates
            : 'monotone'; // in case of aggregated values (months, years, ...)
}

export type { LineType };

export { ChartHandler };

