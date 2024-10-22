type ObjectType = {
    [ key: string ]: any
}

type UnitType = 'm3' | 'mm' | '%' | 'oC' | 'km2' | '';

type EvaluationType = { 
    [ key: number ]: string 
}

export type { 
    ObjectType , UnitType, EvaluationType
};