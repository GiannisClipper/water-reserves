import type { ObjectType } from '@/types';
import { timeKey } from "@/helpers/time";

abstract class DataParser {    

    _headers: string[] = [];
    _data: ObjectType[] = [];

    constructor() {};

    get headers(): string[] {
        return this._headers;
    } 

    get data(): ObjectType[] {
        return this._data;
    }
}

class SavingsDataParser extends DataParser {    

    static addDiff = ( data: ObjectType[] ): ObjectType[] => 

        data.map( ( row: ObjectType, i: number ) => {
            const { time, quantity } = row;
            let diff: number = 0;
            let percent: number = 0;
            if ( i > 0 ) {
                const prevQuantity: number = Math.round( data[ i - 1 ].quantity );
                diff = quantity - prevQuantity
                percent = Math.round( diff / prevQuantity * 10000 ) / 100;
            }
            return { time, quantity, diff, percent };
        } );

    
    constructor( responseResult: any ) {
        super();

        // parse data

        let data: any[][] = responseResult && responseResult.data || [];

        this._data = data.map( ( row: any[], i: number ) => {
            const time: string = row[ 0 ];
            const quantity: number = Math.round( row[ 1 ] );
            return { time, quantity };
        } );

        // add difference between previous and current values

        this._data = SavingsDataParser.addDiff( this._data );

        // add headers
        if ( this._data.length ) {
            const { time } = this._data[ 0 ];
            this._headers.push( timeKey( time ) );
            this._headers.push( 'quantity' );
            this._headers.push( 'diff' );
            this._headers.push( 'percent' );
        }        
    };
}

class SavingsReservoirDataParser extends DataParser {    

    static nestQuantities = ( data: ObjectType[] ): ObjectType[] => {

        const timeObj: ObjectType = {};
    
        data.forEach( ( row: ObjectType ) => { 
            const { time } = row;
            timeObj[ time ] = { time, quantities: {} };
        } );
    
        data.forEach( ( row: ObjectType ) => {
            const { time, reservoir_id, quantity } = row;
            timeObj[ time ].quantities[ reservoir_id ] = { quantity };
        } );
    
        return Object.values( timeObj );
    }
    
    static addTotal = ( data: ObjectType[] ): ObjectType[] => 

        data.map( ( row: ObjectType ) => {
            const { quantities, ...otherKeys } = row;
            const total = Object
                .values( quantities )
                .map( q => q.quantity )
                .reduce( ( a, b ) => a + b, 0 );
            return { ...otherKeys, quantities, total };
        } );
    
    static addPercent = ( data: ObjectType[] ): ObjectType[] =>
    
        data.map( ( row: ObjectType ) => {
            const { quantities, ...otherKeys } = row;
            const total: number = Object
                .values( quantities )
                .map( q => q.quantity )
                .reduce( ( a, b ) => a + b, 0 );
            Object.keys( quantities ).forEach( id => {
                quantities[ id ].percent = Math.round( quantities[ id ].quantity / total * 100 );
            } );
            return { ...otherKeys, quantities };
        } );

    _reservoirs: ObjectType[] = [];

    constructor( responseResult: any ) {
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
            const quantity: number = Math.round( row[ 2 ] );
            return { time, reservoir_id, quantity };
        } );

        // nest quantities

        this._data = SavingsReservoirDataParser.nestQuantities( this._data );

        // add total quantity

        this._data = SavingsReservoirDataParser.addTotal( this._data );
    
        // add quality/total percentage

        this._data = SavingsReservoirDataParser.addPercent( this._data );

        // parse reservoirs 

        let reservoirs: ObjectType[] = responseResult && responseResult.legend && responseResult.legend.reservoirs || [];

        if ( this._data.length ) {
            const { quantities } = this._data[ 0 ];
            const ids: string[] = Object.keys( quantities );
            this._reservoirs = reservoirs.filter( r => ids.includes( `${r.id}` ) );
        }

        // add headers
        if ( this._data.length ) {
            const { time, quantities } = this._data[ 0 ];
            this._headers.push( timeKey( time ) );
            this._headers.push( 'total' );
    
            const ids: string[] = Object.keys( quantities );
            reservoirs
                .filter( r => ids.includes( `${r.id}` ) )
                .forEach( r => {
                    this._headers.push( r.name_en ) 
                    this._headers.push( 'percent' ) 
                } );
        }
    }

    get reservoirs(): ObjectType[] {
        return this._reservoirs;
    }
}


const getAggregatedHeaders = ( data: ObjectType[] ): string[] => {

    const headers: string[] = [];

    if ( data.length ) {
        const { time } = data[ 0 ];
        headers.push( timeKey( time ) );
        headers.push( 'quantity' );
        headers.push( 'diff' );
        headers.push( 'percent' );
    }

    return headers;
}

const getNonAggregatedHeaders = ( data: ObjectType[], reservoirs: ObjectType[] ): string[] => {

    const headers: string[] = [];

    if ( data.length ) {
        const { time, quantities } = data[ 0 ];
        headers.push( timeKey( time ) );
        headers.push( 'total' );

        const ids: string[] = Object.keys( quantities );
        reservoirs = reservoirs.filter( r => ids.includes( `${r.id}` ) );
        reservoirs.forEach( r => {
            headers.push( r.name_en ) 
            headers.push( 'percent' ) 
        } );
    }

    return headers;
}

export { getAggregatedHeaders, getNonAggregatedHeaders };

export { SavingsDataParser, SavingsReservoirDataParser };