import DataHandler from '.';

import ValueParserCollection from "@/logic/ValueParser/ValueParserCollection";
import { PrimaryValueParser, SecondaryValueParser } from '@/logic/ValueParser';

import type { ObjectType } from "@/types";

class MultiDataHandler extends DataHandler {    

    type: string = 'multi';

    constructor( responseResult: any, specifierCollection: ValueParserCollection ) {
        super( responseResult, specifierCollection );

        let result: ObjectType = responseResult || {};
        
        // get the join key (no dataset assigned) and the datasets 
        // all values will be placed in one flat object, the join key identifies the objects
    
        const joinParser: PrimaryValueParser = this.specifierCollection.getByDataset()[ 0 ];
        const joinKey: string = joinParser[ 'key' ];
        const datasets = this.specifierCollection.getDatasets();
        
        // get the primary values, these comming directly from http response 

        const joinObj: ObjectType = {};
        for ( const dataset of datasets ) {

            // get the primary value specifiers for each dataset
            const specifiers: PrimaryValueParser[] = [
                joinParser,
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

        this.data = Object.values( joinObj );
    
        // get the secondary values, these resulting from primary values calculation
        
        const specifiers: SecondaryValueParser[] = specifierCollection.getSecondaryParsers();
        for ( const specifier of specifiers ) {
            specifier.parser( this.data, this.legend );
        }

        // console.log( 'this.data', this.data)
    }
}

export default MultiDataHandler;
