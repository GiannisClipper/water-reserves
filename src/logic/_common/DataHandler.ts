import type { ObjectType } from '@/types';
import { timeKey } from "@/helpers/time";

abstract class DataHandler {    

    abstract type: string;

    _headers: string[] = [];
    _data: ObjectType[] = [];

    constructor() {};

    get headers(): string[] {
        return this._headers;
    } 

    get data(): ObjectType[] {
        return this._data;
    }

    // toJSON() is used for serialization, considering the Error: 
    // Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. 
    // Classes or null prototypes are not supported.
    toJSON(): ObjectType {
        return {
            type: this.type,
            headers: this._headers,
            data: this._data,
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

        let data: any[][] = responseResult && responseResult.data || [];

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

    _items: ObjectType[] = [];
    _itemsKey: string = '';

    constructor( responseResult: any, itemsKey: string ) {
        super();

        // parse headers

        const headers: string[] = responseResult && responseResult.headers || [];

        // parse data

        let data: any[][] = responseResult && responseResult.data || [];
    
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

        // parse items 

        let items: ObjectType[] = responseResult && responseResult.legend && responseResult.legend[ itemsKey ] || [];

        if ( this._data.length ) {
            const { values } = this._data[ 0 ];
            const ids: string[] = Object.keys( values );
            this._items = items.filter( r => ids.includes( `${r.id}` ) );
        }

        this._itemsKey = itemsKey;

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

type PropsType = {
    endpoint: string
    searchParams: any
    result: any
}

const makeDataHandler = ( { endpoint, searchParams, result }: PropsType ): DataHandler => {

    let type: string = '';
    let itemsKey: string = '';
    let dataHandler: DataHandler;

    if ( endpoint === 'savings' ) {
        type = searchParams.reservoir_aggregation ? 'single' : 'stack';
        itemsKey = 'reservoirs';
    }

    if ( type === 'single' ) {
        dataHandler = new SingleDataHandler( result );

    } else {
        dataHandler = new StackDataHandler( result, itemsKey );
    }

    return dataHandler;
}

export { 
    DataHandler, SingleDataHandler, StackDataHandler, 
    makeDataHandler 
};