import MultiDataHandler from '@/logic/DataHandler/MultiDataHandler';
import { ValueSpecifierCollection } from '@/logic/ValueSpecifier';

import type { ObjectType } from '@/types';

class SingleDataHandler extends MultiDataHandler {    

    type: string = 'single';

    _items: ObjectType[] = [];
    _itemsKey: string = '';

    constructor( responseResult: any, specifierCollection: ValueSpecifierCollection ) {
        super( responseResult, specifierCollection );
    }
}

export default SingleDataHandler;

