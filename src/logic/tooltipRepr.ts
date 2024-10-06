import type { ObjectType } from '@/types';

import ObjectList from '@/helpers/objects/ObjectList';
import { NestedValueSpecifier } from './ValueSpecifier';

// makeItemsRepr() is used in stacked area and bar charts (in tooltips)

const makeItemsRepr = ( 
    items: ObjectType[], payload: ObjectType, nSpecifier: NestedValueSpecifier 
): ObjectType[] => {

    const values = payload[ nSpecifier.key ];

    // toReversed: placing from bottom to top the lines in chart
    const result: any[] = items.toReversed().map( ( item: ObjectType, i: number ) => {

            const { id, name_el: name } = item;

            if ( values[ id ] ) {
                const value: number = values[ id ][ nSpecifier.nestedValue ];
                const percentage: number = values[ id ][ 'percentage' ];
                return { name, value, percentage };
            }
            return null;
        } )
        .filter( ( item: ObjectType | null ) => item !== null );

    return result;
}

// makeItemsOrderedRepr() is used in stacked line chart (in tooltip)
 
const makeItemsOrderedRepr = ( 
    items: ObjectType[], payload: ObjectType, nSpecifier: NestedValueSpecifier 
): ObjectType[] => {

    let result: ObjectType[] = makeItemsRepr( items, payload, nSpecifier );
    result = new ObjectList( result ).sortBy( 'value', 'desc' );
    return result;
}

export { makeItemsRepr, makeItemsOrderedRepr };