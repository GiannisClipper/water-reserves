import { ObjectType } from "@/types"
import type { UnitType } from '@/types';

interface ValueHandlerType {
    key: string
    label?: string
    unit?: UnitType
    color?: ObjectType
}

class ValueHandler {

    key: string;
    label: string;
    unit: UnitType;
    color: ObjectType

    constructor( { key, label, unit, color }: ValueHandlerType ) {
        this.key = key
        this.label = label || '';
        this.unit = unit || '';
        this.color = color || {};
    }

    read = ( data: ObjectType ) => {
        let result: any = data;
        for ( const key of this.key.split( '.' ) ) {
            result = result[ 'key' ];
        }
        return result;
    }

    toJSON(): ObjectType {
        return {
            key: this.key,
            label: this.label,
            unit: this.unit,
            color: this.color,
        }
    }
}

class ValueHandlerCollection {

    specifiers: ValueHandler[]

    constructor( specifiers: ValueHandler[] ) {
        this.specifiers = specifiers;
    }

    getByKey( key: string ): ValueHandler {
        return this.specifiers.filter( s => s[ 'key' ] === key )[ 0 ];
    }
}

const timeRepr: ObjectType = {
    '': 'Time density (date)',
    'date': 'Time density (date)',
    'month': 'Time density (month)',
    'year': 'Time density (year)',
    'custom_year': 'Time density (hydrologic year)',
};

const valueRepr: ObjectType = {
    '': 'Daily quantity',
    avg: 'Mean daily quantity',
    sum: 'Sum quantity',
};

export { 
    ValueHandler, ValueHandlerCollection,
    timeRepr, valueRepr,
};
