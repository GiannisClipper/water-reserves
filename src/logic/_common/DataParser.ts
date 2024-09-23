import type { ObjectType } from '@/types';
import { timeKey } from "@/helpers/time";

abstract class DataParser {    

    headers: string[] = [];
    data: ObjectType[] = [];

    constructor() {};

    getHeaders(): string[] {
        return this.headers;
    } 

    getData(): ObjectType[] {
        return this.data;
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

        this.data = data.map( ( row: any[], i: number ) => {
            const time: string = row[ 0 ];
            const quantity: number = Math.round( row[ 1 ] );
            return { time, quantity };
        } );

        // add difference between previous and current values

        this.data = SavingsDataParser.addDiff( this.data );

        // add headers
        if ( this.data.length ) {
            const { time } = this.data[ 0 ];
            this.headers.push( timeKey( time ) );
            this.headers.push( 'quantity' );
            this.headers.push( 'diff' );
            this.headers.push( 'percent' );
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

    reservoirs: ObjectType[] = [];

    constructor( responseResult: any ) {
        super();

        // parse headers

        const headers: string[] = responseResult && responseResult.headers || [];

        // parse data

        let data: any[][] = responseResult && responseResult.data || [];
    
        if ( headers.length && headers[ 0 ] === 'id' ) {
            data = data.map( ( row: any[], i: number ) => row.slice( 1 ) );
        }
    
        this.data = data.map( ( row: any[], i: number ) => {
            const time: string = row[ 0 ];
            const reservoir_id: string = row[ 1 ];
            const quantity: number = Math.round( row[ 2 ] );
            return { time, reservoir_id, quantity };
        } );

        // nest quantities

        this.data = SavingsReservoirDataParser.nestQuantities( this.data );

        // add total quantity

        this.data = SavingsReservoirDataParser.addTotal( this.data );
    
        // add quality/total percentage

        this.data = SavingsReservoirDataParser.addPercent( this.data );

        // parse reservoirs 

        let reservoirs: ObjectType[] = responseResult && responseResult.legend && responseResult.legend.reservoirs || [];

        if ( this.data.length ) {
            const { quantities } = this.data[ 0 ];
            const ids: string[] = Object.keys( quantities );
            this.reservoirs = reservoirs.filter( r => ids.includes( `${r.id}` ) );
        }

        // add headers
        if ( this.data.length ) {
            const { time, quantities } = this.data[ 0 ];
            this.headers.push( timeKey( time ) );
            this.headers.push( 'total' );
    
            const ids: string[] = Object.keys( quantities );
            reservoirs
                .filter( r => ids.includes( `${r.id}` ) )
                .forEach( r => {
                    this.headers.push( r.name_en ) 
                    this.headers.push( 'percent' ) 
                } );
        }
    }

    getReservoirs(): ObjectType[] {
        return this.reservoirs;
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