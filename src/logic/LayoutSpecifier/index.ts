import type { ObjectType, UnitType } from "@/types";
import { ValueHandler } from "../ValueHandler";

interface LayoutSpecifierType {
    title?: string
    unit?: UnitType
    colors?: ObjectType[]
}

interface ChartLayoutSpecifierType extends LayoutSpecifierType {
    xValueHandler: ValueHandler
    yValueHandlers: ValueHandler[]
    xLabel?: string
    yLabel?: string
}

abstract class LayoutSpecifier {

    title: string;
    unit: UnitType;
    colors: ObjectType[];

    constructor( { title, unit, colors }: LayoutSpecifierType ) {
        this.title = title || 'Title'
        this.unit = unit || '';
        this.colors = colors || [];
    }

    toJSON(): ObjectType {
        return {
            title: this.title,
            unit: this.unit,
            colors: this.colors,
        }
    }
}

class ChartLayoutSpecifier extends LayoutSpecifier {

    xValueHandler: ValueHandler
    yValueHandlers: ValueHandler[]
    xLabel?: string
    yLabel?: string

    constructor( { xValueHandler, yValueHandlers, xLabel, yLabel, ...otherProps }: ChartLayoutSpecifierType ) {
        super( otherProps );
        this.xValueHandler = xValueHandler;
        this.yValueHandlers = yValueHandlers;
        this.xLabel = xLabel || 'xLabel';
        this.yLabel = yLabel || 'yLabel';
    }

    toJSON(): ObjectType {
        return {
            ...super.toJSON(),
            xValueHandler: this.xValueHandler,
            yValueHandlers: this.yValueHandlers,
            xLabel: this.xLabel,
            yLabel: this.yLabel,
        }
    }
}

export { LayoutSpecifier, ChartLayoutSpecifier };
