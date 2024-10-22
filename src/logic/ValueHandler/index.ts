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
    color?: ObjectType

    constructor( { key, label, unit, color }: ValueHandlerType ) {
        this.key = key
        this.label = label || '';
        this.unit = unit || '';
        this.color = color || color;
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

export { ValueHandler };
