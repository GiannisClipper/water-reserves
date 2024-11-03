type ObjectType = {
    [ key: string ]: any
}

type LineType = 'linear' | 'monotone';

type ValueType = 'time' | 'number' | '';

type UnitType = 'm3' | 'mm' | '%' | 'oC' | 'km2' | '';

type EvaluationType = { 
    [ key: number ]: string 
}

export type { 
    ObjectType, LineType, ValueType, UnitType, EvaluationType
};