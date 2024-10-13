import DataHandler from '.';

import { 
    ValueSpecifierCollection, 
    PrimaryValueSpecifier, 
    SecondaryValueSpecifier, 
    NestedValueSpecifier 
} from '@/logic/ValueSpecifier';

import type { ObjectType } from '@/types';

class StackDataHandler extends DataHandler {    

    type: string = 'stack';

    _specifierCollection: ValueSpecifierCollection;

    _items: ObjectType[] = [];
    _itemsKey: string = '';

    constructor( responseResult: any, specifierCollection: ValueSpecifierCollection ) {
        super();

        let result: Object = responseResult || {};

        // get the join key (no dataset assigned) and the dataset (one dataset in this handler)
    
        this._specifierCollection = specifierCollection;
        const joinSpecifier: PrimaryValueSpecifier = this._specifierCollection.getByDataset()[ 0 ];
        const joinKey: string = joinSpecifier[ 'key' ];
        const dataset: string = this._specifierCollection.getDatasets()[ 0 ];

        // get the primary values, these comming directly from http response 

        // get the primary value specifiers
        const specifiers: PrimaryValueSpecifier[] = [
            joinSpecifier,
            ...specifierCollection.getPrimarySpecifiers()
        ]
    
        // put in a list of objects the array results for each dataset
        let arr: ObjectType[] = result[ dataset ].data.map( 

            // get the values
            ( row: any[], i: number ): ObjectType => {
                const obj: ObjectType = {};
                for ( const specifier of specifiers ) {
                    obj[ specifier[ 'key' ] ] = row[ specifier[ 'index' ] ]
                }
                return obj;
            } 
        );

        // process the nested values

        const nSpecifier: NestedValueSpecifier = specifierCollection.getNestedSpecifiers()[ 0 ];

        const nestObj: ObjectType = {};    
        arr.forEach( ( row: ObjectType ) => { 
            const key: string = nSpecifier.key;
            nestObj[ row[ joinKey ] ] = { [ joinKey ]: row[ joinKey ], [ key ]: {} };
        } );
        arr.forEach( ( row: ObjectType ) => {
            const { key, nestedKey, nestedInnerKey } = nSpecifier;

            const nestedKeyValue: string = row[ nestedKey ];
            const nestedInnerKeyValue: any = row[ nestedInnerKey ];

            // for example: time.locations.2 = { location_id: 2, value: 234 }
            nestObj[ row[ joinKey ] ][ key ][ nestedKeyValue ] = { 
                [ nestedKey ]: nestedKeyValue,
                [ nestedInnerKey ]: nestedInnerKeyValue,
            };
        } );
    
        arr = Object.values( nestObj );

        // get the secondary values, these resulting from primary values calculation

        const specifiers2: SecondaryValueSpecifier[] = specifierCollection.getSecondarySpecifiers();

        for ( const specifier of specifiers2 ) {
            arr = specifier.parser( arr );
        }
        
        this._data = arr;
        // console.log( 'this._data', this._data)

        // parse itemsKey, items 

        this._itemsKey = Object.keys( result[ dataset ].legend )[ 0 ];

        let items: ObjectType[] = result[ dataset ].legend && result[ dataset ].legend[ this._itemsKey ] || [];

        if ( this._data.length ) {
            const nestedObj = this._data[ 0 ][ nSpecifier.key ];
            const ids: string[] = Object.keys( nestedObj ).map( id => `${id}` );
            this._items = items.filter( r => ids.includes( `${r.id}` ) );
        }

        console.log( 'this._items', this._items)

    }

    get items(): ObjectType[] {
        return this._items;
    }

    get itemsKey(): string {
        return this._itemsKey;
    }

    toJSON(): ObjectType {
        return {
            ...super.toJSON(),
            items: this._items,
            itemsKey: this._itemsKey,
        }
    }
}

export default StackDataHandler;