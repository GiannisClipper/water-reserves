import { EvaluationType, ObjectType, UnitType } from "@/types";
import { ValueHandler } from "../../ValueHandler";

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
}

class ChartLayoutHandler extends MinimalChartLayoutHandler {

    title?: string
    xLabel?: string
    yLabel?: string

    constructor( { xValueHandler, yValueHandlers, title, xLabel, yLabel }: ChartLayoutHandlerType ) {
        super( { xValueHandler, yValueHandlers } );
        this.title = title || '(title)';
        this.xLabel = xLabel || '(xLabel)';
        this.yLabel = yLabel || '(yLabel)';
    }

    toJSON(): ObjectType {
        return {
            ...super.toJSON(),
            title: this.title,
            xLabel: this.xLabel,
            yLabel: this.yLabel,
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
    EvaluationChartLayoutHandler 
};
