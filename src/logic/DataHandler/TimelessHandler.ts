import MultiDataHandler from '@/logic/DataHandler/MultiDataHandler';
import { ValueSpecifierCollection } from '@/logic/ValueSpecifier';

import type { ObjectType } from '@/types';

class TimelessDataHandler extends MultiDataHandler {    

    type: string = 'timeless';

    _items: ObjectType[] = [];
    _itemsKey: string = '';

    constructor( responseResult: any, specifierCollection: ValueSpecifierCollection ) {
        super( responseResult, specifierCollection );

        let result: Object = responseResult || {};

        // parse itemsKey, items

        this._specifierCollection = specifierCollection;
        const dataset: string = this._specifierCollection.getDatasets()[ 0 ];
        this._itemsKey = Object.keys( result[ dataset ].legend )[ 0 ];
        this._items = result[ dataset ].legend[ this._itemsKey ] || [];
    }
}

export default TimelessDataHandler;