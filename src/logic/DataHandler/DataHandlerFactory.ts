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

import DataHandler from ".";
import { SingleDataHandler, SingleSpatialDataHandler} from "./SingleDataHandler";
import MultiDataHandler from "./MultiDataHandler";
import {
    ReservoirsStackDataHandler, FactoriesStackDataHandler, LocationsStackDataHandler
} from "./StackDataHandler";

import type { ObjectType } from "@/types";

type PropsType = {
    endpoint: string
    searchParams: any
    result: any
}

class DataHandlerFactory {

    private _dataHandler: DataHandler;
    private type: string = '';

    private _specifierCollection: ValueParserCollection;

    constructor( { endpoint, searchParams, result }: PropsType ) {

        switch ( endpoint ) {

            case 'savings': {
                if ( searchParams.reservoir_aggregation ) {
                    this.type = 'single';
                    this._specifierCollection = new ValueParserCollection( [
                        new TimeValueParser( { index: 0 } ),
                        new SavingsValueParser( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                        new SavingsDifferenceValueParser( {} ),
                        new SavingsGrowthValueParser( {} ),
                    ] );

                } else {
                    this.type = 'stack';
                    this._specifierCollection = new ValueParserCollection( [
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
                    this.type = 'single';
                    this._specifierCollection = new ValueParserCollection( [
                        new TimeValueParser( { index: 0 } ),
                        new ProductionValueParser( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                        new ProductionDifferenceValueParser( {} ),
                        new ProductionGrowthValueParser( {} ),
                    ] );
                } else {
                    this.type = 'stack';
                    this._specifierCollection = new ValueParserCollection( [
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
                    this.type = 'single';
                    this._specifierCollection = new ValueParserCollection( [
                        new TimeValueParser( { index: 0 } ),
                        new PrecipitationValueParser( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                        new PrecipitationDifferenceValueParser( {} ),
                        new PrecipitationGrowthValueParser( {} ),
                    ] );
                } else {
                    this.type = 'stack';
                    this._specifierCollection = new ValueParserCollection( [
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
                    this.type = 'multi';
                    this._specifierCollection = new ValueParserCollection( [
                        new TimeValueParser( { index: 0 } ),
                        new TemperatureMinValueParser( { index: 3, parser: ( v: number ): number => Math.round( v ) } ),
                        new TemperatureMeanValueParser( { index: 4, parser: ( v: number ): number => Math.round( v ) } ),
                        new TemperatureMaxValueParser( { index: 5, parser: ( v: number ): number => Math.round( v ) } ),
                    ] );
    
                } else {
                    this.type = 'multi';
                    this._specifierCollection = new ValueParserCollection( [
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
                    this.type = 'single';
                    this._specifierCollection = new ValueParserCollection( [
                        new TimeValueParser( { index: 0 } ),
                        new EventsValueParser( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                        new EventsDifferenceValueParser( {} ),
                        new EventsGrowthValueParser( {} ),
                    ] );
                }
                else {
                    this.type = 'single,spatial';
                    this._specifierCollection = new ValueParserCollection( [
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
                this.type = 'multi';
                this._specifierCollection = new ValueParserCollection( [
                    new TimeValueParser( { index: 0 } ),
                    new SavingsValueParser( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                    new SavingsGrowthValueParser( {} ),
                    new ProductionValueParser( { index: 1, parser: ( v: number ): number => Math.round( v ) } ), 
                    new ProductionGrowthValueParser( {} ), 
                ] );
                break;
            }

            case 'savings-precipitation': {
                this.type = 'multi';
                this._specifierCollection = new ValueParserCollection( [
                    new TimeValueParser( { index: 0 } ),
                    new SavingsValueParser( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                    new SavingsGrowthValueParser( {} ),
                    new PrecipitationValueParser( { index: 1, parser: ( v: number ): number => Math.round( v ) } ), 
                    new PrecipitationGrowthValueParser( {} ), 
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

            case 'single,spatial': {
                this._dataHandler = new SingleSpatialDataHandler( result, this._specifierCollection );
                break;
            }

            case 'stack': {
                const DataHandlerClass: ObjectType = {
                    'savings': ReservoirsStackDataHandler,
                    'production': FactoriesStackDataHandler,
                    'precipitation': LocationsStackDataHandler,
                }
                this._dataHandler = new DataHandlerClass[ endpoint ]( result, this._specifierCollection );
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

export default DataHandlerFactory;