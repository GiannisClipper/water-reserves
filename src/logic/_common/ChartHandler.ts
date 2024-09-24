import { SKY, ROSE } from '@/helpers/colors';
import type { ObjectType } from "@/types";

type LineType = 'linear' | 'monotone';


class ChartHandler {

    _data: ObjectType[] = [];

    _xTicks: string[] = [];
    _yTicks: number[] = [];

    _color: ObjectType = SKY;

    constructor( data: ObjectType[] ) {
        this._data = data;
        this._xTicks = this._calculateXTicks();
        this._yTicks = this._calculateYTicks();
    }

    private _calculateXTicks = (): string[] => {

        let values = this._data.map( ( row: { [ key: string ]: any } ) => row.time );
    
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

        const minYValues = this._data.map( ( row: ObjectType ) => {
            const { time, quantity, quantities } = row;
    
            // case of multiple quantities
            if ( quantities !== undefined ) {
                return Math.min( ...Object.values( quantities ).map( q => q.quantity ) );
            }
    
            // case of single quantity
            return quantity;
        } );
    
        const maxYValues = this._data.map( ( row: ObjectType ) => {
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

    get data(): ObjectType[] {
        return this._data;
    }

    get xTicks(): string[] {
        return this._xTicks;
    }

    get yTicks(): number[] {
        return this._yTicks;
    }

    get minYTick(): number {
        return this._yTicks.length ? this._yTicks[ 0 ] : 0;
    }

    get maxYTick(): number { 
        return this._yTicks.length ? this._yTicks[ this._yTicks.length - 1 ] : 0;
    }

    get lineType(): LineType { 
        return this._xTicks.length && this._xTicks[ 0 ].length === 10 
            ? 'linear' // in case of full dates
            : 'monotone'; // in case of aggregated values (months, years, ...)
    }

    get color():ObjectType { 
        return this._color;
    }
}

export type { LineType };

export { ChartHandler };

