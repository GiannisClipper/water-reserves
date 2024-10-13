import { ValueSpecifierCollection } from "@/logic/ValueSpecifier";

import type { ObjectType } from '@/types';

abstract class DataHandler {    

    abstract type: string;

    abstract _specifierCollection: ValueSpecifierCollection

    _headers: string[] = [];
    _data: ObjectType[] = [];

    constructor() {};

    get headers(): string[] {
        return this._headers;
    } 

    get data(): ObjectType[] {
        return this._data;
    }

    get specifierCollection(): ValueSpecifierCollection {
        return this._specifierCollection;
    }

    // toJSON() is used for serialization, considering the Error: 
    // Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. 
    // Classes or null prototypes are not supported.
    toJSON(): ObjectType {
        return {
            type: this.type,
            headers: this._headers,
            data: this._data,
            valueSpecifiers: this.specifierCollection.specifiers.map( s => s.toJSON() )
        }
    }
}

export default DataHandler;