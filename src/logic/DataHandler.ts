import { 
    PrimaryValueSpecifier, SecondaryValueSpecifier, NestedValueSpecifier,
    ValueSpecifierCollection,
    FactoryIdValueSpecifier,
    FactoriesValueSpecifier,
    LocationIdValueSpecifier,
    LocationsValueSpecifier,
    FactoriesSumValueSpecifier,
    FactoriesPercentageValueSpecifier,
    LocationsSumValueSpecifier,
    LocationsPercentageValueSpecifier,
} from "./ValueSpecifier";

import { 
    TimeValueSpecifier,
    SavingsValueSpecifier, SavingsDifferenceValueSpecifier, SavingsGrowthValueSpecifier, 
    ProductionValueSpecifier, ProductionDifferenceValueSpecifier, ProductionGrowthValueSpecifier,
    PrecipitationValueSpecifier, PrecipitationDifferenceValueSpecifier, PrecipitationGrowthValueSpecifier,
    TemperatureMinValueSpecifier, TemperatureMeanValueSpecifier, TemperatureMaxValueSpecifier,
    TemperatureMeanDifferenceValueSpecifier, TemperatureMeanGrowthValueSpecifier,
    ReservoirsValueSpecifier,
    ReservoirsSumValueSpecifier,
    ReservoirIdValueSpecifier,
    ReservoirsPercentageValueSpecifier,
} from "./ValueSpecifier";

import type { ObjectType } from '@/types';

abstract class DataHandler {    

    abstract type: string;

    abstract _specifierCollection: ValueSpecifierCollection

    _headers: string[] = [];
    _data: ObjectType[] = [];

    constructor() {};

    get headers(): string[] {
        return this._headers;
    } 

    get data(): ObjectType[] {
        return this._data;
    }

    get specifierCollection(): ValueSpecifierCollection {
        return this._specifierCollection;
    }

    // toJSON() is used for serialization, considering the Error: 
    // Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. 
    // Classes or null prototypes are not supported.
    toJSON(): ObjectType {
        return {
            type: this.type,
            headers: this._headers,
            data: this._data,
            valueSpecifiers: this.specifierCollection
                .specifiers.map( s => s.toJSON() )
        }
    }
}

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

class SingleDataHandler extends MultiDataHandler {    

    type: string = 'single';

    constructor( responseResult: any, specifierCollection: ValueSpecifierCollection ) {
        super( responseResult, specifierCollection );
    }
}

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
        console.log( 'this._data', this._data)

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

type PropsType = {
    endpoint: string
    searchParams: any
    result: any
}

class DataHandlerFactory {

    private _dataHandler: DataHandler;
    private type: string = '';

    private _specifierCollection: ValueSpecifierCollection;

    constructor( { endpoint, searchParams, result }: PropsType ) {

        switch ( endpoint ) {

            case 'savings': {
                if ( searchParams.reservoir_aggregation ) {
                    this.type = 'single';
                    this._specifierCollection = new ValueSpecifierCollection( [
                        new TimeValueSpecifier( { index: 0, axeXY: 'X' } ),
                        new SavingsValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ), axeXY: 'Y' } ),
                        new SavingsDifferenceValueSpecifier( {} ),
                        new SavingsGrowthValueSpecifier( {} ),
                    ] );

                } else {
                    this.type = 'stack';
                    this._specifierCollection = new ValueSpecifierCollection( [
                        new TimeValueSpecifier( { index: 0, axeXY: 'X' } ),
                        new ReservoirIdValueSpecifier( { index: 1 } ),
                        new SavingsValueSpecifier( { index: 2, parser: ( v: number ): number => Math.round( v ) } ),
                        new ReservoirsValueSpecifier( { axeXY: 'Y' } ),
                        new ReservoirsSumValueSpecifier( { axeXY: 'Y' } ),
                        new ReservoirsPercentageValueSpecifier( {} )
                    ] );
                }
                break;
            } 

            case 'production': {
                if ( searchParams.factory_aggregation ) {
                    this.type = 'single';
                    this._specifierCollection = new ValueSpecifierCollection( [
                        new TimeValueSpecifier( { index: 0, axeXY: 'X' } ),
                        new ProductionValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ), axeXY: 'Y' } ),
                        new ProductionDifferenceValueSpecifier( {} ),
                        new ProductionGrowthValueSpecifier( {} ),
                    ] );
                } else {
                    this.type = 'stack';
                    this._specifierCollection = new ValueSpecifierCollection( [
                        new TimeValueSpecifier( { index: 0, axeXY: 'X' } ),
                        new FactoryIdValueSpecifier( { index: 1 } ),
                        new ProductionValueSpecifier( { index: 2, parser: ( v: number ): number => Math.round( v ) } ),
                        new FactoriesValueSpecifier( { axeXY: 'Y' } ),
                        new FactoriesSumValueSpecifier( { axeXY: 'Y' } ),
                        new FactoriesPercentageValueSpecifier( {} )
                    ] );
                }
                break;
            }

            case 'precipitation': {
                if ( searchParams.location_aggregation ) {
                    this.type = 'single';
                    this._specifierCollection = new ValueSpecifierCollection( [
                        new TimeValueSpecifier( { index: 0, axeXY: 'X' } ),
                        new PrecipitationValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ), axeXY: 'Y' } ),
                        new PrecipitationDifferenceValueSpecifier( {} ),
                        new PrecipitationGrowthValueSpecifier( {} ),
                    ] );
                } else {
                    this.type = 'stack';
                    this._specifierCollection = new ValueSpecifierCollection( [
                        new TimeValueSpecifier( { index: 0, axeXY: 'X' } ),
                        new LocationIdValueSpecifier( { index: 1 } ),
                        new PrecipitationValueSpecifier( { index: 2, parser: ( v: number ): number => Math.round( v ) } ),
                        new LocationsValueSpecifier( { axeXY: 'Y' } ),
                        new LocationsSumValueSpecifier( { axeXY: 'Y' } ),
                        new LocationsPercentageValueSpecifier( {} )
                    ] );
                }
                break;
            }

            case 'temperature': {
                if ( searchParams.location_aggregation ) {
                    this.type = 'single';
                    this._specifierCollection = new ValueSpecifierCollection( [
                        new TimeValueSpecifier( { index: 0, axeXY: 'X' } ),
                        new TemperatureMeanValueSpecifier( { index: 3, parser: ( v: number ): number => Math.round( v ), axeXY: 'Y' } ),
                        new TemperatureMeanDifferenceValueSpecifier( {} ),
                        new TemperatureMeanGrowthValueSpecifier( {} ),
                        new TemperatureMinValueSpecifier( { index: 2, parser: ( v: number ): number => Math.round( v ), axeXY: 'Y' } ),
                        new TemperatureMaxValueSpecifier( { index: 4, parser: ( v: number ): number => Math.round( v ), axeXY: 'Y' } ),
                    ] );
                } else {
                    this.type = 'stack';
                    this._specifierCollection = new ValueSpecifierCollection( [
                        new TimeValueSpecifier( { index: 0, axeXY: 'X' } ),
                        new LocationIdValueSpecifier( { index: 1 } ),
                        new TemperatureMinValueSpecifier( { index: 3, parser: ( v: number ): number => Math.round( v ) } ),
                        new TemperatureMeanValueSpecifier( { index: 4, parser: ( v: number ): number => Math.round( v ) } ),
                        new TemperatureMaxValueSpecifier( { index: 5, parser: ( v: number ): number => Math.round( v ) } ),
                        new LocationsValueSpecifier( { axeXY: 'Y' } ),
                        new LocationsSumValueSpecifier( { axeXY: 'Y' } ),
                        new LocationsPercentageValueSpecifier( {} )
                    ] );
                }
                break;
            }

            case 'savings-production': {
                this.type = 'multi';
                this._specifierCollection = new ValueSpecifierCollection( [
                    new TimeValueSpecifier( { index: 0, axeXY: 'X' } ),
                    new SavingsValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                    new SavingsGrowthValueSpecifier( { axeXY: 'Y', label: 'Αποθέματα' } ),
                    new ProductionValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ) } ), 
                    new ProductionGrowthValueSpecifier( { axeXY: 'Y', label: 'Παραγωγή νερού' } ), 
                ] );
                break;
            }

            case 'savings-precipitation': {
                this.type = 'multi';
                this._specifierCollection = new ValueSpecifierCollection( [
                    new TimeValueSpecifier( { index: 0, axeXY: 'X' } ),
                    new SavingsValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                    new SavingsGrowthValueSpecifier( { axeXY: 'Y', label: 'Αποθέματα' } ),
                    new PrecipitationValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ) } ), 
                    new PrecipitationGrowthValueSpecifier( { axeXY: 'Y', label: 'Υετός' } ), 
                ] );
                break;
            }
            default:
                throw `Invalid endpoint (${endpoint}) used in DataHandlerFactory()`;
        }
    
        switch ( this.type ) {
    
            case 'single': {
                this._dataHandler = new SingleDataHandler( result, this._specifierCollection );
                break;
            }
            case 'stack': {
                this._dataHandler = new StackDataHandler( result, this._specifierCollection );
                break;
            }
            case 'multi': {
                this._dataHandler = new MultiDataHandler( result, this._specifierCollection );
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