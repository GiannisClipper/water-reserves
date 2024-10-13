import type { UnitType } from '@/logic/MetadataHandler';

const Unit = ( { unit }: { unit: UnitType } ) => {
    if ( unit === 'm3' ) {
        return ( <>m<sup>3</sup></> );
    }
    if ( unit === 'oC' ) {
        return ( <><sup>o</sup>C</> );
    }
    return unit;
}

export { Unit }
