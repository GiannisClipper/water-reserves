import { 
    ValueSpecifier,
    PrimaryValueSpecifier, ReservoirIdValueSpecifier, NestedValueSpecifier,
    TimeValueSpecifier,
    SavingsValueSpecifier, SavingsGrowthValueSpecifier, 
    ProductionValueSpecifier, ProductionGrowthValueSpecifier,
    PrecipitationValueSpecifier, PrecipitationGrowthValueSpecifier,
    ReservoirsValueSpecifier,
    ReservoirsSumValueSpecifier,
    SecondaryValueSpecifier,
    ReservoirsPercentageValueSpecifier,
    SavingsDifferenceValueSpecifier,
    ProductionDifferenceValueSpecifier,
    PrecipitationDifferenceValueSpecifier,
} from "./ValueSpecifier";

import type { ValueSpecifierType } from "./ValueSpecifier";
import type { ObjectType } from '@/types';

abstract class DataHandler {    

    abstract type: string;

    abstract _valueSpecifiers: ValueSpecifier[]

    _headers: string[] = [];
    _data: ObjectType[] = [];

    constructor() {};

    get headers(): string[] {
        return this._headers;
    } 

    get data(): ObjectType[] {
        return this._data;
    }

    get valueSpecifiers(): ValueSpecifier[] {
        return this._valueSpecifiers;
    }

    // toJSON() is used for serialization, considering the Error: 
    // Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. 
    // Classes or null prototypes are not supported.
    toJSON(): ObjectType {
        return {
            type: this.type,
            headers: this._headers,
            data: this._data,
            valueSpecifiers: this._valueSpecifiers.map( s => s.toJSON() )
        }
    }
}

class SingleDataHandler extends DataHandler {    

    _valueSpecifiers: ValueSpecifier[];

    type: string = 'single';

    constructor( responseResult: any, valueSpecifiers: ValueSpecifier[] ) {
        super();

        let result: ObjectType = responseResult || {};

        // read the join-value and the datasets 
        // join-key should be common in all datasets
        // all values will be placed in one flat object (join-value identifies each of the objects)
    
        this._valueSpecifiers = valueSpecifiers;
        const joinKey = this._valueSpecifiers.filter( s => s.isJoinValue ).map( s => s.key )[ 0 ];
        const datasets = new Set( this._valueSpecifiers.filter( s => s.dataset ).map( s => s.dataset ) );
        
        // get the primary values, these comming directly from http response 

        const joinObj: ObjectType = {};
        for ( const dataset of Array.from( datasets ) ) {
    
            // put in temp variable the results for each dataset
            const temp = result[ dataset ].data.map( ( row: any[], i: number ) => {

                const primarySpecifiers: ValueSpecifierType[] = valueSpecifiers.filter( 
                    s => s instanceof PrimaryValueSpecifier && ( s[ 'dataset' ] == dataset || s[ 'isJoinValue' ] ) );

                const obj: ObjectType = {};
                for ( const specifier of primarySpecifiers ) {
                    obj[ specifier[ 'key' ] ] = row[ specifier[ 'index' ] ]
                }
                return obj;
            } );

            // join the results of all datasets in flat objects using the common join key
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
        
        const secondarySpecifiers: ValueSpecifierType[] = valueSpecifiers.filter( s => s instanceof SecondaryValueSpecifier );
        for ( const specifier of secondarySpecifiers ) {
            arr = specifier.parser( arr );
        }

        this._data = arr;
        console.log( 'this._data', this._data)
    }
}

class MultiDataHandler extends SingleDataHandler {    

    type: string = 'multi';

    constructor( responseResult: any, valueSpecifiers: ValueSpecifier[] ) {
        super( responseResult, valueSpecifiers );
    }
}

class StackDataHandler extends DataHandler {    

    type: string = 'stack';

    _valueSpecifiers: ValueSpecifier[];

    _items: ObjectType[] = [];
    _itemsKey: string = '';

    constructor( responseResult: any, valueSpecifiers: ValueSpecifier[] ) {
        super();

        let result: Object = responseResult || {};

        // read the join-value and the dataset (single dataset in this handler)
    
        this._valueSpecifiers = valueSpecifiers;
        const joinKey = this._valueSpecifiers.filter( s => s.isJoinValue ).map( s => s.key )[ 0 ];
        const dataset = this._valueSpecifiers.filter( s => s.dataset ).map( s => s.dataset )[ 0 ];
        
        // get the primary values, these comming directly from http response 
    
        const primarySpecifiers: ValueSpecifierType[] = valueSpecifiers.filter( s => s instanceof PrimaryValueSpecifier );

        // put in temp variable the results for each dataset
        let arr = result[ dataset ].data.map( ( row: any[], i: number ) => {
            const obj: ObjectType = {};
            for ( const specifier of primarySpecifiers ) {
                obj[ specifier[ 'key' ] ] = row[ specifier[ 'index' ] ]
            }
            return obj;
        } );

        // process the nested values

        const nestedSpecifier: ValueSpecifierType = valueSpecifiers.filter( s => s instanceof NestedValueSpecifier )[ 0 ];

        const nestObj: ObjectType = {};    
        arr.forEach( ( row: ObjectType ) => { 
            const key: string = nestedSpecifier.key;
            nestObj[ row[ joinKey ] ] = { [ joinKey ]: row[ joinKey ], [ key ]: {} };
        } );
        arr.forEach( ( row: ObjectType ) => {
            const key: string = nestedSpecifier.key;
            const nestedKey: string = row[ nestedSpecifier.nestedKey ];
            const nestedValueKey: string = nestedSpecifier.nestedValue;
            const nestedValue: any = row[ nestedSpecifier.nestedValue ];
            nestObj[ row[ joinKey ] ][ key ][ nestedKey ] = { 
                [ nestedSpecifier.nestedKey ]: nestedKey,
                [ nestedValueKey ]: nestedValue,
            };
        } );
    
        arr = Object.values( nestObj );

        // get the secondary values, these resulting from primary values calculation

        const secondarySpecifiers: ValueSpecifierType[] = valueSpecifiers.filter( s => s instanceof SecondaryValueSpecifier );
        for ( const specifier of secondarySpecifiers ) {
            arr = specifier.parser( arr );
        }
        
        this._data = arr;
        console.log( 'this._data', this._data)


        // parse itemsKey, items 

        this._itemsKey = Object.keys( result[ dataset ].legend )[ 0 ];

        let items: ObjectType[] = result[ dataset ].legend && result[ dataset ].legend[ this._itemsKey ] || [];

        if ( this._data.length ) {
            const nestObj = this._data[ 0 ][ nestedSpecifier.key as string ];
            const ids: string[] = Object.keys( nestObj ).map( id => `${id}` );
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

type PropsType = {
    endpoint: string
    searchParams: any
    result: any
}

class DataHandlerFactory {

    private _dataHandler: DataHandler;
    private type: string = '';

    private _valueSpecifiers: ValueSpecifier[] = [];

    constructor( { endpoint, searchParams, result }: PropsType ) {

        switch ( endpoint ) {

            case 'savings': {
                if ( searchParams.reservoir_aggregation ) {
                    this.type = 'single';
                    this._valueSpecifiers = [
                        new TimeValueSpecifier( { isJoinValue: true, index: 0, chartXY: 'X' } ),
                        new SavingsValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ), chartXY: 'Y' } ),
                        new SavingsDifferenceValueSpecifier( {} ),
                        new SavingsGrowthValueSpecifier( {} ),
                    ];
                } else {
                    this.type = 'stack';
                    this._valueSpecifiers = [
                        new TimeValueSpecifier( { isJoinValue: true, index: 0, chartXY: 'X' } ),
                        new ReservoirIdValueSpecifier( { index: 1 } ),
                        new SavingsValueSpecifier( { index: 2, parser: ( v: number ): number => Math.round( v ), chartXY: 'Y' } ),
                        new ReservoirsValueSpecifier( {} ),
                        new ReservoirsSumValueSpecifier( {} ),
                        new ReservoirsPercentageValueSpecifier( {} )
                    ];
                }
                break;
            } 
            case 'production': {
                this.type = searchParams.factory_aggregation ? 'single' : 'stack';
                this._valueSpecifiers = [
                    new TimeValueSpecifier( { isJoinValue: true, index: 0, chartXY: 'X' } ),
                    new ProductionValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ), chartXY: 'Y' } ),
                    new ProductionDifferenceValueSpecifier( {} ),
                    new ProductionGrowthValueSpecifier( {} ),
                ];
                break;
            }
            case 'precipitation': {
                this.type = searchParams.location_aggregation ? 'single' : 'stack';
                this._valueSpecifiers = [
                    new TimeValueSpecifier( { isJoinValue: true, index: 0, chartXY: 'X' } ),
                    new PrecipitationValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ), chartXY: 'Y' } ),
                    new PrecipitationDifferenceValueSpecifier( {} ),
                    new PrecipitationGrowthValueSpecifier( {} ),
                ];
                break;
            }
            case 'savings-production': {
                this.type = 'multi';
                this._valueSpecifiers = [
                    new TimeValueSpecifier( { isJoinValue: true, index: 0, chartXY: 'X' } ),
                    new SavingsValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                    new SavingsGrowthValueSpecifier( { chartXY: 'Y', label: 'Αποθέματα' } ),
                    new ProductionValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ) } ), 
                    new ProductionGrowthValueSpecifier( { chartXY: 'Y', label: 'Παραγωγή νερού' } ), 
                ];
                break;
            }
            case 'savings-precipitation': {
                this.type = 'multi';
                this._valueSpecifiers = [
                    new TimeValueSpecifier( { isJoinValue: true, index: 0, chartXY: 'X' } ),
                    new SavingsValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                    new SavingsGrowthValueSpecifier( { chartXY: 'Y', label: 'Αποθέματα' } ),
                    new PrecipitationValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ) } ), 
                    new PrecipitationGrowthValueSpecifier( { chartXY: 'Y', label: 'Υετός' } ), 
                ];
                break;
            }
            default:
                throw `Invalid endpoint (${endpoint}) used in DataHandlerFactory()`;
        }
    
        switch ( this.type ) {
    
            case 'single': {
                this._dataHandler = new SingleDataHandler( result, this._valueSpecifiers );
                break;
            }
            case 'stack': {
                this._dataHandler = new StackDataHandler( result, this._valueSpecifiers );
                break;
            }
            case 'multi': {
                this._dataHandler = new MultiDataHandler( result, this._valueSpecifiers );
                break;
            }
            default:
                throw `Invalid type (${this.type}) used in DataHandlerFactory()`;
        }
    }

    get dataHandler(): DataHandler {
        return this._dataHandler;
    }
}

export { 
    DataHandler, SingleDataHandler, MultiDataHandler, StackDataHandler, DataHandlerFactory 
};