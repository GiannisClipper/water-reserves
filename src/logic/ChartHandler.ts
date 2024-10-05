import type { ObjectType } from "@/types";

type LineType = 'linear' | 'monotone';

abstract class ChartHandler {

    _data: ObjectType[] = [];
    _valueSpecifiers: ObjectType[] = [];

    _xTicks: string[] = [];
    _yTicks: number[] = [];

    _lineType: LineType | null = null
 
    abstract _yValues: number[];

    constructor( data: ObjectType[], valueSpecifiers: ObjectType[] ) {
        this._data = data;
        this._valueSpecifiers = valueSpecifiers;
    }

    protected calculateXTicks = (): string[] => {

        let values = this._data.map( ( row: ObjectType ) => row[ this.getXValueKey() ] );
    
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

    protected calculateYTicks = (): number[] => {

        const minYValue: number = Math.min( ...this._yValues ) * 0.90;
        const maxYValue: number = Math.max( ...this._yValues ) * 1.05;
        const difference: number = ( maxYValue - minYValue );
        // console.log( 'minYValue, maxYValue, difference', minYValue, maxYValue, difference )
        // for example: 0 1278834027 1278834027
    
        let log: number = Math.log10( difference );
        const logDecimals: number = log - Math.trunc( log );
        // console.log( 'log, logDecimals', log, logDecimals ) 
        // for example: 9.10681418338768 0.10681418338768012
    
        log = Math.trunc( log ) - ( logDecimals * 100000 < 69897 ? 1 : 0 );
        // log = log >= 1 ? log : 1;
        // console.log( 'log', log ) 
        // for example: 8
    
        let baseUnit: number = Math.pow( 10, log );
        let times = Math.ceil( Math.ceil( difference / baseUnit ) / 10 );
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

    get valueSpecifiers(): ObjectType[] {
        return this._valueSpecifiers;
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

        if ( this._lineType ) {
            return this._lineType
        }
    
        return this._xTicks.length && this._xTicks[ 0 ].length === 10 
            ? 'linear' // in case of full dates
            : 'monotone'; // in case of aggregated values (months, years, ...)
    }

    getXValueKey(): string {
        return this._valueSpecifiers.
            filter( s => s[ 'chartXY' ] === 'X' )[ 0 ]
            .key;
    }

    getYValueKey(): string {
        return this._valueSpecifiers.
            filter( s => s[ 'chartXY' ] === 'Y' )[ 0 ]
            .key;
    }

    getYValueKeys(): string[] {
        return this._valueSpecifiers.
            filter( s => s[ 'chartXY' ] === 'Y' )
            .map( s => s[ 'key' ] );
    }

    public toJSON(): ObjectType {
        return {
            data: this._data,
            valueSpecifiers: this._valueSpecifiers,
            xTicks: this._xTicks,
            yTicks: this._yTicks,
            yValues: this._yValues,
        }
    }
}

class SingleChartHandler extends ChartHandler {

    _yValues: number[];

    constructor( data: ObjectType[], valueSpecifiers: ObjectType[] ) {
        super( data, valueSpecifiers );
        this._yValues = data.map( ( row: ObjectType ) => row[ this.YValueKey ] );

        this._xTicks = this.calculateXTicks();
        this._yTicks = this.calculateYTicks();
    }
}

class StackChartHandler extends ChartHandler {

    _yValues: number[];

    constructor( data: ObjectType[], valueSpecifiers: ObjectType[] ) {
    
        super( data, valueSpecifiers );
    
        this._yValues = data.map( ( row: ObjectType ) => {

            const { total, values } = row;
            const arr: Object[] = Object.values( values );
            return [ total, ...arr.map( ( v: ObjectType ) => v.value ) ];
        } ).flat();

        this._xTicks = this.calculateXTicks();
        this._yTicks = this.calculateYTicks();
    }
}

class MultiChartHandler extends ChartHandler {

    // set lineType to 'linear', to have MORE SHARP lines and 
    // MORE CLEAR comparison between different quantities
    _lineType: LineType | null = 'linear'

    _yValues: number[];

    constructor( data: ObjectType[], valueSpecifiers: ObjectType[] ) {
    
        super( data, valueSpecifiers );

        this._yValues = data.map( ( row: ObjectType ) => row[ this.getYValueKey() ] );

        const yValueKeys = this.getYValueKeys();

        this._yValues = data.map( ( row: ObjectType ) => {
            const newRow: ObjectType = {};
            for ( const key of Object.keys( row ) ) {
                if ( yValueKeys.includes( key ) ) {
                    newRow[ key ] = row[ key ]
                }
            }
            return Object.values( newRow );
        } ).flat();

        this._xTicks = this.calculateXTicks();
        this._yTicks = this.calculateYTicks();
    }
}

class ChartHandlerFactory {

    private _chartHandler: ChartHandler;

    constructor( type: string, data: ObjectType[], valueSpecifiers: ObjectType[] ) {

        switch ( type ) {

            case 'single': {
                this._chartHandler = new SingleChartHandler( data, valueSpecifiers );
                break;
            } 
            case 'stack': {
                this._chartHandler = new StackChartHandler( data, valueSpecifiers );
                break;
            }
            case 'multi': {
                this._chartHandler = new MultiChartHandler( data, valueSpecifiers );
                break;
            }

            default:
                throw `Invalid type (${type}) used in ChartHandlerFactory`;
        }
    }

    get chartHandler(): ChartHandler {
        return this._chartHandler;
    }
}

export type { LineType };

export { ChartHandler, SingleChartHandler, StackChartHandler,MultiChartHandler, ChartHandlerFactory };

