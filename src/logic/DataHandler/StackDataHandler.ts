import DataHandler from '.';

import ValueParserCollection from "@/logic/ValueParser/ValueParserCollection";
import { PrimaryValueParser, SecondaryValueParser, NestedValueParser } from '@/logic/ValueParser';

import type { ObjectType } from '@/types';
import ObjectList from '@/helpers/objects/ObjectList';

class StackDataHandler extends DataHandler {    

    type: string = 'stack';

    constructor( responseResult: any, specifierCollection: ValueParserCollection ) {
        super( responseResult, specifierCollection );

        let result: Object = responseResult || {};
        //console.log( 'result', result )

        // get the join key (no dataset assigned) and the dataset (one dataset in this handler)
    
        const joinParser: PrimaryValueParser = this.specifierCollection.getByDataset()[ 0 ];
        const joinKey: string = joinParser[ 'key' ];
        const dataset: string = this.specifierCollection.getDatasets()[ 0 ];

        // get the primary values, these comming directly from http response 

        // get the primary value specifiers
        const specifiers: PrimaryValueParser[] = [
            joinParser,
            ...specifierCollection.getPrimaryParsers()
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

        const nParser: NestedValueParser = specifierCollection.getNestedParsers()[ 0 ];
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

        const specifiers2: SecondaryValueParser[] = specifierCollection.getSecondaryParsers();

        for ( const specifier of specifiers2 ) {
            specifier.parser( this.data, this.legend );
        }
        // console.log( 'this.data', this.data)
    }
}

class ReservoirsStackDataHandler extends StackDataHandler {

    constructor( responseResult: any, specifierCollection: ValueParserCollection ) {
        super( responseResult, specifierCollection );

        if ( this.data.length ) {
            const nestedObj = this.data[ 0 ][ 'reservoirs' ];
            const ids: string[] = Object.keys( nestedObj ).map( id => `${id}` );
            if ( this.legend ) {
                const filtered: ObjectType[] = this.legend[ 'reservoirs' ].filter( r => ids.includes( `${r.id}` ) );
                this.legend [ 'reservoirs' ] = new ObjectList( filtered ).sortBy( 'start', 'asc' );
            }
        }
    }
}

class FactoriesStackDataHandler extends StackDataHandler {

    constructor( responseResult: any, specifierCollection: ValueParserCollection ) {
        super( responseResult, specifierCollection );

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

class LocationsStackDataHandler extends StackDataHandler {

    constructor( responseResult: any, specifierCollection: ValueParserCollection ) {
        super( responseResult, specifierCollection );

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
    StackDataHandler, 
    ReservoirsStackDataHandler, FactoriesStackDataHandler, LocationsStackDataHandler 
};