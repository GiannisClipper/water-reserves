import { ValueHandler } from '.';

class ValueHandlerCollection {

    specifiers: ValueHandler[]

    constructor( specifiers: ValueHandler[] ) {
        this.specifiers = specifiers;
    }

    getByKey( key: string ): ValueHandler {
        return this.specifiers.filter( s => s[ 'key' ] === key )[ 0 ];
    }
}

export default ValueHandlerCollection;
