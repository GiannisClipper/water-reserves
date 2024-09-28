import ParamValues from '@/logic/ParamValues';

import {
    ROSE, PINK, FUCHSIA, PURPLE, VIOLET,
    INDIGO, BLUE, SKY, CYAN, TEAL, EMERALD, 
    GREEN, LIME, YELLOW, AMBER, ORANGE, RED, 
    STONE, NEUTRAL, ZINC, GRAY, SLATE
} from '@/helpers/colors';

import type { ObjectType } from '@/types';

type UnitType = 'm3' | 'mm' | '%';

abstract class CardHandler {    

    _interval: string;

    _date: string;
    abstract _value: number;
    abstract _unit: UnitType;

    constructor( result: ObjectType, key: string ) {

        const { recent_entries } = result[ key ];
        const firstEntry = recent_entries[ 0 ];
        const lastEntry = recent_entries[ recent_entries.length - 1 ];

        const firstDay = firstEntry.date.substring( 5 ).split( '-' ).reverse().join( '/' );
        const lastDay = lastEntry.date.substring( 5 ).split( '-' ).reverse().join( '/' );
        this._interval = `${firstDay}-${lastDay}`;

        this._date = lastEntry.date.split( '-' ).reverse().join( '/' );
    }

    get interval(): string {
        return this._interval;
    }

    get date(): string {
        return this._date;
    }

    get value(): number {
        return this._value;
    }

    get unit(): UnitType {
        return this._unit;
    }

    toJSON(): ObjectType {
        return {
            interval: this.interval,
            date: this.date, 
            value: this.value,
            unit: this.unit,
        }
    }
}

class SavingsCardHandler extends CardHandler {

    _value: number;
    _unit: UnitType = 'm3';

    constructor( result: any ) {

        const key: string = 'savings';
        super( result, key );

        const { recent_entries } = result[ key ];
        this._value = recent_entries[ recent_entries.length - 1 ].quantity;
    }
}

class ProductionCardHandler extends CardHandler {

    _value: number;
    _unit: UnitType = 'm3';

    constructor( result: any ) {

        const key: string = 'production';
        super( result, key );

        const { recent_entries } = result[ key ];
        this._value = recent_entries[ recent_entries.length - 1 ].quantity;
    }
}

class PrecipitationCardHandler extends CardHandler {

    _value: number;
    _unit: UnitType = 'mm';

    constructor( result: any ) {

        const key: string = 'weather';
        super( result, key );

        const { recent_entries } = result[ key ];
        this._value = recent_entries[ recent_entries.length - 1 ].precipitation_sum;
    }
}

class CardHandlerFactory {

    private _cardHandler: CardHandler;

    constructor( option: string, result: ObjectType ) {

        switch ( option ) {

            case 'savings': {
                this._cardHandler = new SavingsCardHandler( result );
                break;
            } 
            case 'production': {
                this._cardHandler = new ProductionCardHandler( result );
                break;
            }
            case 'precipitation': {
                this._cardHandler = new PrecipitationCardHandler( result );
                break;
            }
            default:
                throw `Invalid option (${option}) used in CardHandlerFactory`;
        }
    }

    get cardHandler(): CardHandler {
        return this._cardHandler;
    }
}

export { CardHandler, CardHandlerFactory };