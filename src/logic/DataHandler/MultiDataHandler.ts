import DataHandler from '.';

import { 
    ValueSpecifierCollection, 
    PrimaryValueSpecifier, 
    SecondaryValueSpecifier 
} from '@/logic/ValueSpecifier';

import type { ObjectType } from "@/types";

class MultiDataHandler extends DataHandler {    

    type: string = 'multi';

    _specifierCollection: ValueSpecifierCollection

    constructor( responseResult: any, specifierCollection: ValueSpecifierCollection ) {
        super();

        let result: ObjectType = responseResult || {};
        
        // get the join key (no dataset assigned) and the datasets 
        // all values will be placed in one flat object, the join key identifies the objects
    
        this._specifierCollection = specifierCollection;
        const joinSpecifier: PrimaryValueSpecifier = this._specifierCollection.getByDataset()[ 0 ];
        const joinKey: string = joinSpecifier[ 'key' ];
        const datasets = this._specifierCollection.getDatasets();
        
        // get the primary values, these comming directly from http response 

        const joinObj: ObjectType = {};
        for ( const dataset of datasets ) {

            // get the primary value specifiers for each dataset
            const specifiers: PrimaryValueSpecifier[] = [
                joinSpecifier,
                ...specifierCollection.getByDataset( dataset )
            ]
            
            // put in a list of objects the array results for each dataset
            const temp: ObjectType[] = result[ dataset ].data.map( 

                // get the values
                ( row: any[], i: number ): ObjectType => {
                    const obj: ObjectType = {};
                    for ( const specifier of specifiers ) {
                        obj[ specifier[ 'key' ] ] = row[ specifier[ 'index' ] ]
                    }
                    return obj;
                } 
            );

            // join the results of each dataset in a common flat object
            temp.forEach( ( row: ObjectType ) => { 
                const joinValue = row[ joinKey ];
                if ( ! joinObj[ joinValue ] ) {
                    joinObj[ joinValue ] = {};
                }
                joinObj[ joinValue ] = { ...joinObj[ joinValue ], ...row };
            } );
        }

        let arr: ObjectType[] = Object.values( joinObj );
    
        // get the secondary values, these resulting from primary values calculation
        
        const specifiers: SecondaryValueSpecifier[] = specifierCollection.getSecondarySpecifiers();
        for ( const specifier of specifiers ) {
            arr = specifier.parser( arr );
        }

        this._data = arr;
        console.log( 'this._data', this._data)
    }
}

export default MultiDataHandler;
