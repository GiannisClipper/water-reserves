import ObjectList from '@/helpers/objects/ObjectList';

import type { ObjectType } from '@/types';

const makeReservoirsRepr = ( reservoirs: ObjectType[], quantities: ObjectType ): ObjectType[] => {

    // toReversed: considering the order of lines in chart (from bottom to top)
    const result: ObjectType[] = reservoirs.toReversed().map( ( reservoir: ObjectType, i: number ) => {

        const { id, name_el: name } = reservoir;
        const quantity: number = quantities[ id ] || 0;
        const total = Object.values( quantities ).reduce( ( a, b ) => a + b, 0 );
        const percent: number = Math.round( quantity / total * 100 );
        return { name, quantity, percent };
    } );

    return result;
}

const makeReservoirsOrderedRepr = ( reservoirs: ObjectType[], quantities: ObjectType ): ObjectType[] => {

    let result: ObjectType[] = makeReservoirsRepr( reservoirs, quantities );
    result = new ObjectList( result ).sortBy( 'quantity', 'desc' );
    return result;
}

export { 
    makeReservoirsRepr, makeReservoirsOrderedRepr
};