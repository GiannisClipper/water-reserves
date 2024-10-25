import ValueParserCollection from "@/logic/ValueParser/ValueParserCollection";
import { TimeValueParser } from "@/logic/ValueParser";

import {
    SavingsValueParser, 
    ReservoirIdValueParser,
    SavingsDifferenceValueParser, 
    SavingsGrowthValueParser, 
    ReservoirsValueParser, 
    ReservoirsSumValueParser,
    ReservoirsPercentageValueParser, 
} from "@/logic/ValueParser/savings";

import {
    ProductionValueParser, 
    FactoryIdValueParser,
    ProductionDifferenceValueParser, 
    ProductionGrowthValueParser, 
    FactoriesValueParser, 
    FactoriesSumValueParser,
    FactoriesPercentageValueParser, 
} from "@/logic/ValueParser/production";

import {
    PrecipitationValueParser, 
    LocationIdValueParser,
    PrecipitationDifferenceValueParser, 
    PrecipitationGrowthValueParser,
    LocationsValueParser, 
    LocationsSumValueParser,
    LocationsPercentageValueParser, 
} from "@/logic/ValueParser/precipitation";

import {
    TemperatureMinValueParser, 
    TemperatureMeanValueParser, 
    TemperatureMaxValueParser, 
} from "@/logic/ValueParser/temperature";

import {
    MunicipalityIdValueParser,
    EventsValueParser, 
    EventsDifferenceValueParser,
    EventsGrowthValueParser,
    MunicipalityNameValueParser,
    MunicipalityAreaValueParser,
    MunicipalityPopulationValueParser,
    EventsOverAreaValueParser,
    EventsOverPopulationValueParser,
    ClusterValueParser,
} from "@/logic/ValueParser/interruptions";

import DataParser from ".";
import { StandardDataParser, SpatialStandardDataParser} from "./StandardDataParser";

import {
    ReservoirsStackDataParser, FactoriesStackDataParser, LocationsStackDataParser
} from "./StackDataParser";

import type { ObjectType } from "@/types";

type PropsType = {
    endpoint: string
    searchParams: any
    result: any
}

class DataParserFactory {

    private _dataParser: DataParser;
    private type: string = '';

    private _parserCollection: ValueParserCollection;

    constructor( { endpoint, searchParams, result }: PropsType ) {

        switch ( endpoint ) {

            case 'savings': {
                if ( searchParams.reservoir_aggregation ) {
                    this.type = 'standard';
                    this._parserCollection = new ValueParserCollection( [
                        new TimeValueParser( { index: 0 } ),
                        new SavingsValueParser( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                        new SavingsDifferenceValueParser( {} ),
                        new SavingsGrowthValueParser( {} ),
                    ] );

                } else {
                    this.type = 'stack';
                    this._parserCollection = new ValueParserCollection( [
                        new TimeValueParser( { index: 0 } ),
                        new ReservoirIdValueParser( { index: 1 } ),
                        new SavingsValueParser( { index: 2, parser: ( v: number ): number => Math.round( v ) } ),
                        new ReservoirsValueParser( {} ),
                        new ReservoirsSumValueParser( {} ),
                        new ReservoirsPercentageValueParser( {} )
                    ] );
                }
                break;
            } 

            case 'production': {
                if ( searchParams.factory_aggregation ) {
                    this.type = 'standard';
                    this._parserCollection = new ValueParserCollection( [
                        new TimeValueParser( { index: 0 } ),
                        new ProductionValueParser( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                        new ProductionDifferenceValueParser( {} ),
                        new ProductionGrowthValueParser( {} ),
                    ] );
                } else {
                    this.type = 'stack';
                    this._parserCollection = new ValueParserCollection( [
                        new TimeValueParser( { index: 0 } ),
                        new FactoryIdValueParser( { index: 1 } ),
                        new ProductionValueParser( { index: 2, parser: ( v: number ): number => Math.round( v ) } ),
                        new FactoriesValueParser( {} ),
                        new FactoriesSumValueParser( {} ),
                        new FactoriesPercentageValueParser( {} ),
                    ] );
                }
                break;
            }

            case 'precipitation': {
                if ( searchParams.location_aggregation ) {
                    this.type = 'standard';
                    this._parserCollection = new ValueParserCollection( [
                        new TimeValueParser( { index: 0 } ),
                        new PrecipitationValueParser( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                        new PrecipitationDifferenceValueParser( {} ),
                        new PrecipitationGrowthValueParser( {} ),
                    ] );
                } else {
                    this.type = 'stack';
                    this._parserCollection = new ValueParserCollection( [
                        new TimeValueParser( { index: 0 } ),
                        new LocationIdValueParser( { index: 1 } ),
                        new PrecipitationValueParser( { index: 2, parser: ( v: number ): number => Math.round( v ) } ),
                        new LocationsValueParser( {} ),
                        new LocationsSumValueParser( {} ),
                        new LocationsPercentageValueParser( {} ),
                    ] );
                }
                break;
            }

            case 'temperature': {
                if ( searchParams.time_aggregation ) {
                    this.type = 'standard';
                    this._parserCollection = new ValueParserCollection( [
                        new TimeValueParser( { index: 0 } ),
                        new TemperatureMinValueParser( { index: 3, parser: ( v: number ): number => Math.round( v ) } ),
                        new TemperatureMeanValueParser( { index: 4, parser: ( v: number ): number => Math.round( v ) } ),
                        new TemperatureMaxValueParser( { index: 5, parser: ( v: number ): number => Math.round( v ) } ),
                    ] );
    
                } else {
                    this.type = 'standard';
                    this._parserCollection = new ValueParserCollection( [
                        new TimeValueParser( { index: 1 } ),
                        new TemperatureMinValueParser( { index: 4, parser: ( v: number ): number => Math.round( v ) } ),
                        new TemperatureMeanValueParser( { index: 5, parser: ( v: number ): number => Math.round( v ) } ),
                        new TemperatureMaxValueParser( { index: 6, parser: ( v: number ): number => Math.round( v ) } ),
                    ] );
                }
                break;
            }

            case 'interruptions': {
                if ( searchParams.municipality_aggregation ) {
                    this.type = 'standard';
                    this._parserCollection = new ValueParserCollection( [
                        new TimeValueParser( { index: 0 } ),
                        new EventsValueParser( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                        new EventsDifferenceValueParser( {} ),
                        new EventsGrowthValueParser( {} ),
                    ] );
                }
                else {
                    this.type = 'standard,spatial';
                    this._parserCollection = new ValueParserCollection( [
                        new MunicipalityIdValueParser( { index: 0 } ),
                        new EventsValueParser( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                        new MunicipalityNameValueParser( {} ),
                        new MunicipalityAreaValueParser( { index: 2 } ),
                        new MunicipalityPopulationValueParser( { index: 3 } ),
                        new EventsOverAreaValueParser( { index: 4 } ),
                        new EventsOverPopulationValueParser( { index: 5 } ),
                        new ClusterValueParser( { index: 6 } ),
                    ] );
                }            
                break;
            }

            case 'savings-production': {
                this.type = 'standard';
                this._parserCollection = new ValueParserCollection( [
                    new TimeValueParser( { index: 0 } ),
                    new SavingsValueParser( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                    new SavingsGrowthValueParser( {} ),
                    new ProductionValueParser( { index: 1, parser: ( v: number ): number => Math.round( v ) } ), 
                    new ProductionGrowthValueParser( {} ), 
                ] );
                break;
            }

            case 'savings-precipitation': {
                this.type = 'standard';
                this._parserCollection = new ValueParserCollection( [
                    new TimeValueParser( { index: 0 } ),
                    new SavingsValueParser( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                    new SavingsGrowthValueParser( {} ),
                    new PrecipitationValueParser( { index: 1, parser: ( v: number ): number => Math.round( v ) } ), 
                    new PrecipitationGrowthValueParser( {} ), 
                ] );
                break;
            }

            default:
                throw `Invalid endpoint (${endpoint}) used in DataParserFactory()`;
        }
    
        switch ( this.type ) {
    
            case 'standard': {
                this._dataParser = new StandardDataParser( result, this._parserCollection );
                break;
            }

            case 'standard,spatial': {
                this._dataParser = new SpatialStandardDataParser( result, this._parserCollection );
                break;
            }

            case 'stack': {
                const DataParserClass: ObjectType = {
                    'savings': ReservoirsStackDataParser,
                    'production': FactoriesStackDataParser,
                    'precipitation': LocationsStackDataParser,
                }
                this._dataParser = new DataParserClass[ endpoint ]( result, this._parserCollection );
                break;
            }

            default:
                throw `Invalid type (${this.type}) used in DataParserFactory()`;
        }
    }

    get dataParser(): DataParser {
        return this._dataParser;
    }
}

export default DataParserFactory;