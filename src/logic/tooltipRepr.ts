import type { ObjectType } from '@/types';

import ObjectList from '@/helpers/objects/ObjectList';

const makeItemsRepr = ( items: ObjectType[], values: ObjectType ): ObjectType[] => {

    // toReversed: placing from bottom to top the lines in chart
    const result: any[] = items.toReversed()
        .map( ( item: ObjectType, i: number ) => {

            const { id, name_el: name } = item;
            if ( values[ id ] ) {
                const { value=0, percentage=0 } = values[ id ];
                return { name, value, percentage };
            }
            return null;
        } )
        .filter( ( item: ObjectType | null ) => item !== null );

    return result;
}

const makeItemsOrderedRepr = ( items: ObjectType[], values: ObjectType ): ObjectType[] => {

    let result: ObjectType[] = makeItemsRepr( items, values );
    result = new ObjectList( result ).sortBy( 'value', 'desc' );
    return result;
}

export { makeItemsRepr, makeItemsOrderedRepr };