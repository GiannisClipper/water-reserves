import type { ObjectType } from '@/types';

import ObjectList from '@/helpers/objects/ObjectList';

const makeItemsRepr = ( items: ObjectType[], values: ObjectType ): ObjectType[] => {

    // toReversed: placing from bottom to top the reservoir lines in chart
    const result: any[] = items.toReversed()
        .map( ( reservoir: ObjectType, i: number ) => {

            const { id, name_el: name } = reservoir;
            if ( values[ id ] ) {
                const { value=0, percentage=0 } = values[ id ];
                return { name, value, percentage };
            }
            return null;
        } )
        .filter( ( reservoir: ObjectType | null ) => reservoir !== null );

    return result;
}

const makeItemsOrderedRepr = ( items: ObjectType[], values: ObjectType ): ObjectType[] => {

    let result: ObjectType[] = makeItemsRepr( items, values );
    result = new ObjectList( result ).sortBy( 'value', 'desc' );
    return result;
}

export { makeItemsRepr, makeItemsOrderedRepr };