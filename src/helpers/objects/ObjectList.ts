import type { ObjectType } from "@/types";

class ObjectList {

    list: ObjectType[] = [];

    constructor( list: ObjectType[] ) {
        this.list = list;
    }

    findMany( key: string, value: any ): ObjectType[] {
        return this.list.filter( o => o[ key ] === value );
    }

    findOne( key: string, value: any ): ObjectType | null {
        const many: ObjectType[] = this.findMany( key, value );
        if ( many.length ) {
            return many[ 0 ];
        }
        return null;
    }

    sortBy( key: string, order: 'asc' | 'desc' = 'asc' ) {
        const ones: [ number, number ] = order !== 'desc' ? [ 1, -1 ] : [ -1, 1 ]; 
        this.list.sort( (a, b ) => ( a[ key ] > b[ key ] ) ? ones[ 0 ] : ones[ 1 ] );
        return this.list;
    }
}

export default ObjectList;
