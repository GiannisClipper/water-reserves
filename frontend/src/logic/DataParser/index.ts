import ValueParserCollection from "@/logic/ValueParser/ValueParserCollection";

import type { ObjectType } from '@/types';

abstract class DataParser {    

    abstract type: string;

    private _headers: string[] = [];
    private _data: ObjectType[] = [];
    private _legend: ObjectType = {};
    private _parserCollection: ValueParserCollection

    constructor( responseResult: any, parserCollection: ValueParserCollection ) {

        let result: ObjectType = responseResult || {};

        // get legend data if exists

        for ( const key of Object.keys( result ) ) {
            if ( result[ key ].legend ) {
                this._legend = { 
                    ...( this._legend || {} ), 
                    ...result[ key ].legend
                };
            }
        }

        this._parserCollection = parserCollection;
    }        

    get headers(): string[] {
        return this._headers;
    } 

    get data(): ObjectType[] {
        return this._data;
    }

    set data( data: ObjectType[] ) {
        this._data = data;
    }

    get legend(): ObjectType | undefined {
        return this._legend;
    }

    get parserCollection(): ValueParserCollection {
        return this._parserCollection;
    }

    // toJSON() is used for serialization, considering the Error: 
    // Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. 
    // Classes or null prototypes are not supported.
    toJSON(): ObjectType {
        return {
            type: this.type,
            headers: this._headers,
            data: this._data,
            legend: this._legend,
            valueParsers: this.parserCollection.specifiers.map( s => s.toJSON() )
        }
    }
}

export default DataParser;