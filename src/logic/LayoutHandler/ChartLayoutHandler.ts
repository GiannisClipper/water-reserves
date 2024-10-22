import { EvaluationType, ObjectType, UnitType } from "@/types";
import { ValueHandler } from "../ValueHandler";

interface MinimalChartLayoutHandlerType {
    xValueHandler: ValueHandler
    yValueHandlers: ValueHandler[]
    xLabel?: string
    yLabel?: string
}

class MinimalChartLayoutHandler {

    xValueHandler: ValueHandler
    yValueHandlers: ValueHandler[]
    xLabel?: string
    yLabel?: string

    constructor( { xValueHandler, yValueHandlers, xLabel, yLabel }: MinimalChartLayoutHandlerType ) {
        this.xValueHandler = xValueHandler;
        this.yValueHandlers = yValueHandlers;
        this.xLabel = xLabel || 'xLabel';
        this.yLabel = yLabel || 'yLabel';
    }

    toJSON(): ObjectType {
        return {
            xValueHandler: this.xValueHandler.toJSON,
            yValueHandlers: this.yValueHandlers.map( ( handler: ValueHandler ) => handler.toJSON() ),
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

export { MinimalChartLayoutHandler, EvaluationChartLayoutHandler };
