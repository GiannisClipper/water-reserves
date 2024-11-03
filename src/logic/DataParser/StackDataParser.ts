import DataParser from '.';

import ValueParserCollection from "@/logic/ValueParser/ValueParserCollection";
import { PrimaryValueParser, SecondaryValueParser, NestedValueParser } from '@/logic/ValueParser';

import type { ObjectType } from '@/types';
import ObjectList from '@/helpers/objects/ObjectList';

class StackDataParser extends DataParser {    

    type: string = 'stack';

    constructor( responseResult: any, parserCollection: ValueParserCollection ) {
        super( responseResult, parserCollection );

        let result: Object = responseResult || {};
        //console.log( 'result', result )

        // get the join key (no dataset assigned) and the dataset (one dataset in this handler)
    
        const joinParser: PrimaryValueParser = this.parserCollection.getByDataset()[ 0 ];
        const joinKey: string = joinParser[ 'key' ];
        const dataset: string = this.parserCollection.getDatasets()[ 0 ];

        // get the primary values, these comming directly from http response 

        // get the primary value specifiers
        const specifiers: PrimaryValueParser[] = [
            joinParser,
            ...parserCollection.getPrimaryParsers()
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
        for ( const specifier of specifiers ) {
            specifier.parse( arr, this.legend );
        }

        // process the nested values

        const nParser: NestedValueParser = parserCollection.getNestedParsers()[ 0 ];
        // example of nParser =>:
        // key: 'reservoirs', 
        // label: 'Ταμιευτήρες', 
        // nestedKey: 'reservoir_id',
        // nestedInnerKey: 'savings',

        const nestObj: ObjectType = {};    
        arr.forEach( ( row: ObjectType ) => { 
            const key: string = nParser.key;
            nestObj[ row[ joinKey ] ] = { [ joinKey ]: row[ joinKey ], [ key ]: {} };
        } );
        arr.forEach( ( row: ObjectType ) => {
            const { key, nestedKey, nestedInnerKey } = nParser;

            const nestedKeyValue: string = row[ nestedKey ];
            const nestedInnerKeyValue: any = row[ nestedInnerKey ];

            // for example: time.locations.2 = { location_id: 2, value: 234 }
            nestObj[ row[ joinKey ] ][ key ][ nestedKeyValue ] = { 
                [ nestedKey ]: nestedKeyValue,
                [ nestedInnerKey ]: nestedInnerKeyValue,
            };
        } );
    
        this.data = Object.values( nestObj );

        // get the secondary values, these resulting from primary values calculation

        const specifiers2: SecondaryValueParser[] = parserCollection.getSecondaryParsers();

        for ( const specifier of specifiers2 ) {
            specifier.parse( this.data, this.legend );
        }
        // console.log( 'this.data', this.data)
    }
}

class ReservoirsStackDataParser extends StackDataParser {

    constructor( responseResult: any, parserCollection: ValueParserCollection ) {
        super( responseResult, parserCollection );

        if ( this.data.length ) {

            // set reservoir names
            // for ( const row of this.data ) {
            //     for ( const reservoir_id of Object.keys( row.reservoirs ) ) {
            //         row[ 'reservoirs' ][ reservoir_id ].name = this.legend?.reservoirs[ reservoir_id - 1 ].name_en;
            //     }
            // }

            // filter reservoirs in legend
            const nestedObj = this.data[ 0 ][ 'reservoirs' ];
            const ids: string[] = Object.keys( nestedObj ).map( id => `${id}` );
            if ( this.legend ) {
                const filtered: ObjectType[] = this.legend[ 'reservoirs' ].filter( r => ids.includes( `${r.id}` ) );
                this.legend [ 'reservoirs' ] = new ObjectList( filtered ).sortBy( 'start', 'asc' );
            }
        }
    }
}

class FactoriesStackDataParser extends StackDataParser {

    constructor( responseResult: any, parserCollection: ValueParserCollection ) {
        super( responseResult, parserCollection );

        if ( this.data.length ) {
            const nestedObj = this.data[ 0 ][ 'factories' ];
            const ids: string[] = Object.keys( nestedObj ).map( id => `${id}` );
            if ( this.legend ) {
                const filtered: ObjectType[] = this.legend[ 'factories' ].filter( r => ids.includes( `${r.id}` ) )
                this.legend [ 'factories' ] = new ObjectList( filtered ).sortBy( 'start', 'asc' );
            }
        }
    }
}

class LocationsStackDataParser extends StackDataParser {

    constructor( responseResult: any, parserCollection: ValueParserCollection ) {
        super( responseResult, parserCollection );

        if ( this.data.length ) {
            const nestedObj = this.data[ 0 ][ 'locations' ];
            const ids: string[] = Object.keys( nestedObj ).map( id => `${id}` );
            if ( this.legend ) {
                const filtered: ObjectType[] = this.legend[ 'locations' ].filter( r => ids.includes( `${r.id}` ) )
                this.legend [ 'locations' ] = new ObjectList( filtered ).sortBy( 'id', 'asc' );
            }
        }
    }
}

export {
    StackDataParser, 
    ReservoirsStackDataParser, FactoriesStackDataParser, LocationsStackDataParser 
};