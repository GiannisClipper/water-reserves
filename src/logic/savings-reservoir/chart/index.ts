import ObjectList from '@/helpers/objects/ObjectList';

import type { ObjectType } from '@/types';

const makeReservoirsRepr = ( reservoirs: ObjectType[], quantities: ObjectType ): ObjectType[] => {

    // toReversed: placing from bottom to top the reservoir lines in chart
    const result: any[] = reservoirs.toReversed()
        .map( ( reservoir: ObjectType, i: number ) => {

            const { id, name_el: name } = reservoir;
            if ( quantities[ id ] ) {
                const { quantity=0, percent=0 } = quantities[ id ];
                return { name, quantity, percent };
            }
            return null;
        } )
        .filter( ( reservoir: ObjectType | null ) => reservoir !== null );

    return result;
}

const makeReservoirsOrderedRepr = ( reservoirs: ObjectType[], quantities: ObjectType ): ObjectType[] => {

    let result: ObjectType[] = makeReservoirsRepr( reservoirs, quantities );
    result = new ObjectList( result ).sortBy( 'quantity', 'desc' );
    return result;
}

export { makeReservoirsRepr, makeReservoirsOrderedRepr };