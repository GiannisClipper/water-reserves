import { EvaluationType, ObjectType, UnitType } from "@/types";
import { ValueHandler } from "@/logic/ValueHandler";
import { LineType } from "@/types";

interface ChartLayoutHandlerType {
    xValueHandler: ValueHandler
    yValueHandlers: ValueHandler[]
    title?: string
    xLabel?: string
    yLabel?: string
    dataBox: ObjectType
    XTicksCalculator: any
    YTicksCalculator: any
    lineType?: LineType
}

class ChartLayoutHandler {

    xValueHandler: ValueHandler
    yValueHandlers: ValueHandler[]

    title: string;
    xLabel: string;
    yLabel: string;

    dataBox: ObjectType = {};
    xTicks: string[];
    yTicks: number[]; 
    // yValues: number[];

    _lineType: LineType | undefined;

    constructor( {
        xValueHandler, yValueHandlers, 
        title, xLabel, yLabel, dataBox, 
        lineType,
        XTicksCalculator,
        YTicksCalculator,
    }: ChartLayoutHandlerType ) {

        this.xValueHandler = xValueHandler;
        this.yValueHandlers = yValueHandlers;
        this.title = title || '(title)';
        this.xLabel = xLabel || '(xLabel)';
        this.yLabel = yLabel || '(yLabel)';
        this.dataBox = dataBox;
        this._lineType = lineType;

        const xValues = this.dataBox.data.map( ( row: ObjectType ) => row[ this.xValueHandler.key ] );
        this.xTicks = new XTicksCalculator( xValues ).xTicks;

        const yValues: number[] = [];
        for ( const row of dataBox.data ) {
            for ( const handler of this.yValueHandlers ) {
                yValues.push( handler.readFrom( row ) );
            }
        }
        this.yTicks = new YTicksCalculator( yValues ).yTicks;
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
            xValueHandler: this.xValueHandler.toJSON(),
            yValueHandlers: this.yValueHandlers.map( ( handler: ValueHandler ) => handler.toJSON() ),
            title: this.title,
            xLabel: this.xLabel,
            yLabel: this.yLabel,
            dataBox: this.dataBox,
            xTicks: this.xTicks,
            yTicks: this.yTicks,
            // yValues: this.yValues,
        }
    }
}

interface StandardChartLayoutHandlerType extends ChartLayoutHandlerType {
    yDifferenceValueHandlers: ValueHandler[]
    yChangeValueHandlers: ValueHandler[]
}

class StandardChartLayoutHandler extends ChartLayoutHandler {

    yDifferenceValueHandlers: ValueHandler[]
    yChangeValueHandlers: ValueHandler[]

    constructor( { 
        xValueHandler, yValueHandlers, 
        title, xLabel, yLabel, dataBox,
        XTicksCalculator, YTicksCalculator,
        yDifferenceValueHandlers, yChangeValueHandlers,
    }: StandardChartLayoutHandlerType ) {

        super( {
            xValueHandler, yValueHandlers, 
            title, xLabel, yLabel, dataBox,
            XTicksCalculator, YTicksCalculator,
        } )
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

interface StackChartLayoutHandlerType extends ChartLayoutHandlerType {
    yPercentageValueHandlers: ValueHandler[]
}

class StackChartLayoutHandler extends ChartLayoutHandler {

    yPercentageValueHandlers: ValueHandler[]

    constructor( { 
        xValueHandler, yValueHandlers, 
        title, xLabel, yLabel, dataBox,
        XTicksCalculator, YTicksCalculator,
        yPercentageValueHandlers,
    }: StackChartLayoutHandlerType ) {

        super( { 
            xValueHandler, yValueHandlers, 
            title, xLabel, yLabel, dataBox, 
            XTicksCalculator, YTicksCalculator,
        } );
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
    ChartLayoutHandler,
    StandardChartLayoutHandler,
    StackChartLayoutHandler,
    EvaluationChartLayoutHandler 
};
