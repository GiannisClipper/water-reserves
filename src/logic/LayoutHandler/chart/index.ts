import { EvaluationType, ObjectType, UnitType } from "@/types";
import { ValueHandler } from "../../ValueHandler";
import { LineType } from "@/types";

interface MinimalChartLayoutHandlerType {
    xValueHandler: ValueHandler
    yValueHandlers: ValueHandler[]
}

class MinimalChartLayoutHandler {

    xValueHandler: ValueHandler
    yValueHandlers: ValueHandler[]

    constructor( { xValueHandler, yValueHandlers }: MinimalChartLayoutHandlerType ) {
        this.xValueHandler = xValueHandler;
        this.yValueHandlers = yValueHandlers;
    }

    toJSON(): ObjectType {
        return {
            xValueHandler: this.xValueHandler.toJSON(),
            yValueHandlers: this.yValueHandlers.map( ( handler: ValueHandler ) => handler.toJSON() ),
        }
    }
}

interface ChartLayoutHandlerType extends MinimalChartLayoutHandlerType {
    title?: string
    xLabel?: string
    yLabel?: string
    lineType?: LineType
    data: ObjectType[]
}

class ChartLayoutHandler extends MinimalChartLayoutHandler {

    title: string;
    xLabel: string;
    yLabel: string;

    data: ObjectType[] = [];
    xTicks: string[];
    yTicks: number[]; 
    yValues: number[];

    _lineType: LineType | undefined;

    constructor( { 
        xValueHandler, yValueHandlers, 
        title, xLabel, yLabel, data, lineType
    }: ChartLayoutHandlerType ) {

        super( { xValueHandler, yValueHandlers } );
        this.title = title || '(title)';
        this.xLabel = xLabel || '(xLabel)';
        this.yLabel = yLabel || '(yLabel)';
        this.data = data;
        this._lineType = lineType;

        this.yValues = [];
        for ( const row of data ) {
            for ( const handler of this.yValueHandlers ) {
                this.yValues.push( handler.readFrom( row ) );

            }
        }
        this.xTicks = this.calculateXTicks();
        this.yTicks = this.calculateYTicks();
    }

    get minYTick(): number {
        return this.yTicks.length ? this.yTicks[ 0 ] : 0;
    }

    get maxYTick(): number { 
        return this.yTicks.length ? this.yTicks[ this.yTicks.length - 1 ] : 0;
    }

    get lineType(): LineType {

        if ( this._lineType ) {
            return this._lineType
        }
    
        return this.xTicks.length && this.xTicks[ 0 ].length === 10 
            ? 'linear' // in case of full dates
            : 'monotone'; // in case of aggregated values (months, years, ...)
    }

    toJSON(): ObjectType {
        return {
            ...super.toJSON(),
            title: this.title,
            xLabel: this.xLabel,
            yLabel: this.yLabel,
            data: this.data,
            xTicks: this.xTicks,
            yTicks: this.yTicks,
            yValues: this.yValues,
        
        }
    }

    protected calculateXTicks = (): string[] => {

        let values = this.data.map( ( row: ObjectType ) => row[ this.xValueHandler.key ] );
    
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

        const minYValue: number = Math.min( ...this.yValues ) * 0.90;
        const maxYValue: number = Math.max( ...this.yValues ) * 1.05;
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
}

interface MultiChartLayoutHandlerType extends ChartLayoutHandlerType {
    yDifferenceValueHandlers: ValueHandler[]
    yChangeValueHandlers: ValueHandler[]
}

class MultiChartLayoutHandler extends ChartLayoutHandler {

    yDifferenceValueHandlers: ValueHandler[]
    yChangeValueHandlers: ValueHandler[]

    constructor( { 
        xValueHandler, yValueHandlers, 
        title, xLabel, yLabel, data,
        yDifferenceValueHandlers, yChangeValueHandlers
    }: MultiChartLayoutHandlerType ) {

        super( { xValueHandler, yValueHandlers, title, xLabel, yLabel, data } );
        this.yDifferenceValueHandlers = yDifferenceValueHandlers;
        this.yChangeValueHandlers = yChangeValueHandlers;
    }

    toJSON(): ObjectType {
        return {
            ...super.toJSON(),
            yDifferenceValueHandlers: this.yDifferenceValueHandlers,
            yChangeValueHandlers: this.yChangeValueHandlers,
        }
    }
}

interface SingleChartLayoutHandlerType extends MultiChartLayoutHandlerType {}

class SingleChartLayoutHandler extends MultiChartLayoutHandler {}

interface StackChartLayoutHandlerType extends ChartLayoutHandlerType {
    yPercentageValueHandlers: ValueHandler[]
}

class StackChartLayoutHandler extends ChartLayoutHandler {

    yPercentageValueHandlers: ValueHandler[]

    constructor( { 
        xValueHandler, yValueHandlers, 
        title, xLabel, yLabel, data,
        yPercentageValueHandlers
    }: StackChartLayoutHandlerType ) {

        super( { xValueHandler, yValueHandlers, title, xLabel, yLabel, data } );
        this.yPercentageValueHandlers = yPercentageValueHandlers;
    }

    toJSON(): ObjectType {
        return {
            ...super.toJSON(),
            yPercentageValueHandlers: this.yPercentageValueHandlers,
        }
    }
}

interface EvaluationChartLayoutHandlerType {
    evaluation: EvaluationType
    color: ObjectType
}

class EvaluationChartLayoutHandler {

    evaluation: EvaluationType;
    color: ObjectType;

    constructor( { evaluation, color }: EvaluationChartLayoutHandlerType ) {
        this.evaluation = evaluation;
        this.color = color;
    }

    toJSON(): ObjectType {
        return {
            evaluation: this.evaluation,
            color: this.color,
        }
    }
}

export { 
    MinimalChartLayoutHandler, 
    ChartLayoutHandler,
    MultiChartLayoutHandler,
    SingleChartLayoutHandler,
    StackChartLayoutHandler,
    EvaluationChartLayoutHandler 
};
