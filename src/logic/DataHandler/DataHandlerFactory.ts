import ValueSpecifierCollection from "@/logic/ValueSpecifier/ValueSpecifierCollection";
import { TimeValueSpecifier } from "@/logic/ValueSpecifier";

import {
    SavingsValueSpecifier, 
    ReservoirIdValueSpecifier,
    SavingsDifferenceValueSpecifier, 
    SavingsGrowthValueSpecifier, 
    ReservoirsValueSpecifier, 
    ReservoirsSumValueSpecifier,
    ReservoirsPercentageValueSpecifier, 
} from "@/logic/ValueSpecifier/savings";

import {
    ProductionValueSpecifier, 
    FactoryIdValueSpecifier,
    ProductionDifferenceValueSpecifier, 
    ProductionGrowthValueSpecifier, 
    FactoriesValueSpecifier, 
    FactoriesSumValueSpecifier,
    FactoriesPercentageValueSpecifier, 
} from "@/logic/ValueSpecifier/production";

import {
    PrecipitationValueSpecifier, 
    LocationIdValueSpecifier,
    PrecipitationDifferenceValueSpecifier, 
    PrecipitationGrowthValueSpecifier,
    LocationsValueSpecifier, 
    LocationsSumValueSpecifier,
    LocationsPercentageValueSpecifier, 
} from "@/logic/ValueSpecifier/precipitation";

import {
    TemperatureMinValueSpecifier, 
    TemperatureMeanValueSpecifier, 
    TemperatureMaxValueSpecifier, 
} from "@/logic/ValueSpecifier/temperature";

import {
    MunicipalityIdValueSpecifier,
    EventsValueSpecifier, 
    EventsDifferenceValueSpecifier,
    EventsGrowthValueSpecifier,
    MunicipalityNameValueSpecifier,
    MunicipalityAreaValueSpecifier,
    MunicipalityPopulationValueSpecifier,
    EventsOverAreaValueSpecifier,
    EventsOverPopulationValueSpecifier,
    ClusterValueSpecifier,
} from "@/logic/ValueSpecifier/interruptions";

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

    private _specifierCollection: ValueSpecifierCollection;

    constructor( { endpoint, searchParams, result }: PropsType ) {

        switch ( endpoint ) {

            case 'savings': {
                if ( searchParams.reservoir_aggregation ) {
                    this.type = 'single';
                    this._specifierCollection = new ValueSpecifierCollection( [
                        new TimeValueSpecifier( { index: 0 } ),
                        new SavingsValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                        new SavingsDifferenceValueSpecifier( {} ),
                        new SavingsGrowthValueSpecifier( {} ),
                    ] );

                } else {
                    this.type = 'stack';
                    this._specifierCollection = new ValueSpecifierCollection( [
                        new TimeValueSpecifier( { index: 0 } ),
                        new ReservoirIdValueSpecifier( { index: 1 } ),
                        new SavingsValueSpecifier( { index: 2, parser: ( v: number ): number => Math.round( v ) } ),
                        new ReservoirsValueSpecifier( {} ),
                        new ReservoirsSumValueSpecifier( {} ),
                        new ReservoirsPercentageValueSpecifier( {} )
                    ] );
                }
                break;
            } 

            case 'production': {
                if ( searchParams.factory_aggregation ) {
                    this.type = 'single';
                    this._specifierCollection = new ValueSpecifierCollection( [
                        new TimeValueSpecifier( { index: 0 } ),
                        new ProductionValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                        new ProductionDifferenceValueSpecifier( {} ),
                        new ProductionGrowthValueSpecifier( {} ),
                    ] );
                } else {
                    this.type = 'stack';
                    this._specifierCollection = new ValueSpecifierCollection( [
                        new TimeValueSpecifier( { index: 0 } ),
                        new FactoryIdValueSpecifier( { index: 1 } ),
                        new ProductionValueSpecifier( { index: 2, parser: ( v: number ): number => Math.round( v ) } ),
                        new FactoriesValueSpecifier( {} ),
                        new FactoriesSumValueSpecifier( {} ),
                        new FactoriesPercentageValueSpecifier( {} ),
                    ] );
                }
                break;
            }

            case 'precipitation': {
                if ( searchParams.location_aggregation ) {
                    this.type = 'single';
                    this._specifierCollection = new ValueSpecifierCollection( [
                        new TimeValueSpecifier( { index: 0 } ),
                        new PrecipitationValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                        new PrecipitationDifferenceValueSpecifier( {} ),
                        new PrecipitationGrowthValueSpecifier( {} ),
                    ] );
                } else {
                    this.type = 'stack';
                    this._specifierCollection = new ValueSpecifierCollection( [
                        new TimeValueSpecifier( { index: 0 } ),
                        new LocationIdValueSpecifier( { index: 1 } ),
                        new PrecipitationValueSpecifier( { index: 2, parser: ( v: number ): number => Math.round( v ) } ),
                        new LocationsValueSpecifier( {} ),
                        new LocationsSumValueSpecifier( {} ),
                        new LocationsPercentageValueSpecifier( {} ),
                    ] );
                }
                break;
            }

            case 'temperature': {
                if ( searchParams.time_aggregation ) {
                    this.type = 'multi';
                    this._specifierCollection = new ValueSpecifierCollection( [
                        new TimeValueSpecifier( { index: 0 } ),
                        new TemperatureMinValueSpecifier( { index: 3, parser: ( v: number ): number => Math.round( v ) } ),
                        new TemperatureMeanValueSpecifier( { index: 4, parser: ( v: number ): number => Math.round( v ) } ),
                        new TemperatureMaxValueSpecifier( { index: 5, parser: ( v: number ): number => Math.round( v ) } ),
                    ] );
    
                } else {
                    this.type = 'multi';
                    this._specifierCollection = new ValueSpecifierCollection( [
                        new TimeValueSpecifier( { index: 1 } ),
                        new TemperatureMinValueSpecifier( { index: 4, parser: ( v: number ): number => Math.round( v ) } ),
                        new TemperatureMeanValueSpecifier( { index: 5, parser: ( v: number ): number => Math.round( v ) } ),
                        new TemperatureMaxValueSpecifier( { index: 6, parser: ( v: number ): number => Math.round( v ) } ),
                    ] );
                }
                break;
            }

            case 'interruptions': {
                if ( searchParams.municipality_aggregation ) {
                    this.type = 'single';
                    this._specifierCollection = new ValueSpecifierCollection( [
                        new TimeValueSpecifier( { index: 0 } ),
                        new EventsValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                        new EventsDifferenceValueSpecifier( {} ),
                        new EventsGrowthValueSpecifier( {} ),
                    ] );
                }
                else {
                    this.type = 'single,spatial';
                    this._specifierCollection = new ValueSpecifierCollection( [
                        new MunicipalityIdValueSpecifier( { index: 0 } ),
                        new EventsValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                        new MunicipalityNameValueSpecifier( {} ),
                        new MunicipalityAreaValueSpecifier( { index: 2 } ),
                        new MunicipalityPopulationValueSpecifier( { index: 3 } ),
                        new EventsOverAreaValueSpecifier( { index: 4 } ),
                        new EventsOverPopulationValueSpecifier( { index: 5 } ),
                        new ClusterValueSpecifier( { index: 6 } ),
                    ] );
                }            
                break;
            }

            case 'savings-production': {
                this.type = 'multi';
                this._specifierCollection = new ValueSpecifierCollection( [
                    new TimeValueSpecifier( { index: 0 } ),
                    new SavingsValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                    new SavingsGrowthValueSpecifier( {} ),
                    new ProductionValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ) } ), 
                    new ProductionGrowthValueSpecifier( {} ), 
                ] );
                break;
            }

            case 'savings-precipitation': {
                this.type = 'multi';
                this._specifierCollection = new ValueSpecifierCollection( [
                    new TimeValueSpecifier( { index: 0 } ),
                    new SavingsValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ) } ),
                    new SavingsGrowthValueSpecifier( {} ),
                    new PrecipitationValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ) } ), 
                    new PrecipitationGrowthValueSpecifier( {} ), 
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