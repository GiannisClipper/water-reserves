type ObjectType = {
    [ key: string ]: any
}

type LineType = 'linear' | 'monotone';

type UnitType = 'm3' | 'mm' | '%' | 'oC' | 'km2' | '';

type EvaluationType = { 
    [ key: number ]: string 
}

export type { 
    ObjectType, LineType , UnitType, EvaluationType
};