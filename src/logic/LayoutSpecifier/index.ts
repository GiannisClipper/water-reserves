import type { ObjectType, UnitType } from "@/types";

interface LayoutSpecifierType {
    title?: string
    unit?: UnitType
    colors?: ObjectType[]
}

interface ChartLayoutSpecifierType extends LayoutSpecifierType {
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

    xLabel?: string
    yLabel?: string

    constructor( { xLabel, yLabel, ...otherProps }: ChartLayoutSpecifierType ) {
        super( otherProps );
        this.xLabel = xLabel || 'xLabel'
        this.yLabel = yLabel || 'yLabel'
    }

    toJSON(): ObjectType {
        return {
            ...super.toJSON(),
            xLabel: this.xLabel,
            yLabel: this.yLabel,
        }
    }
}

type EvaluationType = { 
    [ key: number ]: string 
}

class CardLayoutSpecifier extends LayoutSpecifier {

    static evaluation: EvaluationType = { 0: 'lower', 1: 'low', 2: 'mid', 3:'high', 4: 'higher' };

    constructor( props: LayoutSpecifierType ) {
        super( props );
    }

    toJSON(): ObjectType {
        return {
            ...super.toJSON(),
            evaluation: CardLayoutSpecifier.evaluation
        }
    }
}

export { LayoutSpecifier, ChartLayoutSpecifier, CardLayoutSpecifier };
