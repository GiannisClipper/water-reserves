import { timeKey } from "@/helpers/time";

import type { ObjectType } from '@/types';

abstract class DataHandler {    

    abstract type: string;

    _headers: string[] = [];
    _data: ObjectType[] = [];

    _valueKeys: string[] = [];

    constructor() {};

    get headers(): string[] {
        return this._headers;
    } 

    get data(): ObjectType[] {
        return this._data;
    }

    get valueKeys(): string[] {
        return this._valueKeys;
    }

    // toJSON() is used for serialization, considering the Error: 
    // Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. 
    // Classes or null prototypes are not supported.
    toJSON(): ObjectType {
        return {
            type: this.type,
            headers: this._headers,
            data: this._data,
            valueKeys: this.valueKeys,
        }
    }
}

class SingleDataHandler extends DataHandler {    

    type: string = 'single';

    static addDiff = ( data: ObjectType[] ): ObjectType[] => 

        data.map( ( row: ObjectType, i: number ) => {
            const { time, value } = row;
            let difference: number = 0;
            let percentage: number = 0;
            if ( i > 0 ) {
                const prevValue: number = Math.round( data[ i - 1 ].value );
                difference = value - prevValue
                percentage = Math.round( difference / prevValue * 10000 ) / 100;
            }
            return { time, value, difference, percentage };
        } );

    
    constructor( responseResult: any ) {
        super();

        // parse data

        const result: Object = responseResult || {};
        this._valueKeys = Object.keys( result );
        const data: [][] = result[ this._valueKeys[ 0 ] ].data;

        this._data = data.map( ( row: any[], i: number ) => {
            const time: string = row[ 0 ];
            const value: number = Math.round( row[ 1 ] );
            return { time, value };
        } );

        // add difference between previous and current values

        this._data = SingleDataHandler.addDiff( this._data );

        // add headers
        if ( this._data.length ) {
            const { time } = this._data[ 0 ];
            this._headers.push( timeKey( time ) );
            this._headers.push( 'value' );
            this._headers.push( 'difference' );
            this._headers.push( 'percentage' );
        }        
    };
}

class StackDataHandler extends DataHandler {    

    type: string = 'stack';

    _items: ObjectType[] = [];
    _itemsKey: string = '';

    static nestValues = ( data: ObjectType[] ): ObjectType[] => {

        const timeObj: ObjectType = {};
    
        data.forEach( ( row: ObjectType ) => { 
            const { time } = row;
            timeObj[ time ] = { time, values: {} };
        } );
    
        data.forEach( ( row: ObjectType ) => {
            const { time, reservoir_id, value } = row;
            timeObj[ time ].values[ reservoir_id ] = { value };
        } );
    
        return Object.values( timeObj );
    }
    
    static addTotal = ( data: ObjectType[] ): ObjectType[] => 

        data.map( ( row: ObjectType ) => {
            const { values, ...otherKeys } = row;
            const total = Object
                .values( values )
                .map( v => v.value )
                .reduce( ( a, b ) => a + b, 0 );
            return { ...otherKeys, values, total };
        } );
    
    static addPercentage = ( data: ObjectType[] ): ObjectType[] =>
    
        data.map( ( row: ObjectType ) => {
            const { values, ...otherKeys } = row;
            const total: number = Object
                .values( values )
                .map( q => q.value )
                .reduce( ( a, b ) => a + b, 0 );
            Object.keys( values ).forEach( id => {
                values[ id ].percentage = Math.round( values[ id ].value / total * 100 );
            } );
            return { ...otherKeys, values };
        } );

    constructor( responseResult: any ) {
        super();

        let result: Object = responseResult || {};
        this._valueKeys = Object.keys( result );
        if ( this._valueKeys.length ) {
            result = result[ this._valueKeys[ 0 ] ];
        }

        // parse headers

        const headers: string[] = result.headers || [];

        // parse data

        let data: [][] = result.data || [];
    
        if ( headers.length && headers[ 0 ] === 'id' ) {
            data = data.map( ( row: any[], i: number ) => row.slice( 1 ) );
        }
    
        this._data = data.map( ( row: any[], i: number ) => {
            const time: string = row[ 0 ];
            const reservoir_id: string = row[ 1 ];
            const value: number = Math.round( row[ 2 ] );
            return { time, reservoir_id, value };
        } );

        // nest values

        this._data = StackDataHandler.nestValues( this._data );

        // add total value

        this._data = StackDataHandler.addTotal( this._data );
    
        // add value/total percentage

        this._data = StackDataHandler.addPercentage( this._data );

        // parse itemsKey, items 

        this._itemsKey = Object.keys( result.legend )[ 0 ];

        let items: ObjectType[] = result.legend && result.legend[ this._itemsKey ] || [];

        if ( this._data.length ) {
            const { values } = this._data[ 0 ];
            const ids: string[] = Object.keys( values );
            this._items = items.filter( r => ids.includes( `${r.id}` ) );
        }

        // add headers
        if ( this._data.length ) {
            const { time, values } = this._data[ 0 ];
            this._headers.push( timeKey( time ) );
            this._headers.push( 'total' );
    
            const ids: string[] = Object.keys( values );
            items
                .filter( r => ids.includes( `${r.id}` ) )
                .forEach( r => {
                    this._headers.push( r.name_en ) 
                    this._headers.push( 'percentage' ) 
                } );
        }
    }

    get items(): ObjectType[] {
        return this._items;
    }

    get itemsKey(): string {
        return this._itemsKey;
    }

    toJSON(): ObjectType {
        return {
            ...super.toJSON(),
            items: this._items,
            itemsKey: this._itemsKey,
        }
    }
}

class MultiDataHandler extends DataHandler {    

    type: string = 'multi';

    constructor( responseResult: any ) {
        super();

        let result: any[] = responseResult || [];

        this._valueKeys = Object.keys( result );

        // parse headers
        if ( result.length ) {
            const time = result[ this._valueKeys[ 0 ] ].headers[ 0 ];
            this._headers = [ time, ...this._valueKeys ];
        }
        
        // parse data

        const timeObj: ObjectType = {};

        for ( const valueKey of this._valueKeys ) {
    
            const temp = result[ valueKey ].data.map( ( row: any[], i: number ) => {
                const time: string = row[ 0 ];
                const value: number = Math.round( row[ 1 ] );
                return { time, value };
            } );

            temp.forEach( ( row: ObjectType ) => { 
                const { time, value } = row;
                if ( ! timeObj[ time ] ) {
                    timeObj[ time ] = { time };
                }
                timeObj[ time ][ valueKey ] = value;
            } );
        }

        for ( const valueKey of this._valueKeys ) {

            const total = Object.values( timeObj )
                .map( row => row[ valueKey ] )
                .reduce( ( tot, val ) => tot + val, 0 );

                const average = total / Object.values( timeObj ).length;

            Object.values( timeObj ).forEach( row => row[ valueKey ] = row[ valueKey ] / average );
        }

        this._data = Object.values( timeObj );
    }
}

type PropsType = {
    endpoint: string
    searchParams: any
    result: any
}

class DataHandlerFactory {

    private _dataHandler: DataHandler;
    private type: string = '';

    constructor( { endpoint, searchParams, result }: PropsType ) {

        switch ( endpoint ) {

            case 'savings': {
                this.type = searchParams.reservoir_aggregation ? 'single' : 'stack';
                break;
            } 
            case 'production': {
                this.type = searchParams.factory_aggregation ? 'single' : 'stack';
                break;
            }
            case 'precipitation': {
                this.type = searchParams.location_aggregation ? 'single' : 'stack';
                break;
            }
            case 'savings-production': {
                this.type = 'multi';
                break;
            }
            default:
                throw `Invalid endpoint (${endpoint}) used in DataHandlerFactory()`;
        }
    
        switch ( this.type ) {
    
            case 'single': {
                this._dataHandler = new SingleDataHandler( result );
                break;
            }
            case 'stack': {
                this._dataHandler = new StackDataHandler( result );
                break;
            }
            case 'multi': {
                this._dataHandler = new MultiDataHandler( result );
                break;
            }
            default:
                throw `Invalid type (${this.type}) used in DataHandlerFactory()`;
        }
    }

    get dataHandler(): DataHandler {
        return this._dataHandler;
    }
}

export { 
    DataHandler, SingleDataHandler, StackDataHandler, DataHandlerFactory 
};