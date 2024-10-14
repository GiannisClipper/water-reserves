import { ValueSpecifierCollection, TimeValueSpecifier } from "@/logic/ValueSpecifier";

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
    InterruptionsValueSpecifier, 
    InterruptionsDifferenceValueSpecifier, 
    InterruptionsGrowthValueSpecifier,
    MunicipalityIdValueSpecifier,
} from "@/logic/ValueSpecifier/interruptions";

import DataHandler from ".";
import SingleDataHandler from "./SingleDataHandler";
import TimelessDataHandler from "./TimelessDataHandler";
import MultiDataHandler from "./MultiDataHandler";
import StackDataHandler from "./StackDataHandler";

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
                if ( searchParams.time_aggregation ) {
                    this.type = 'multi';
                    this._specifierCollection = new ValueSpecifierCollection( [
                        new TimeValueSpecifier( { index: 0, axeXY: 'X' } ),
                        new TemperatureMinValueSpecifier( { index: 3, parser: ( v: number ): number => Math.round( v ), axeXY: 'Y' } ),
                        new TemperatureMeanValueSpecifier( { index: 4, parser: ( v: number ): number => Math.round( v ), axeXY: 'Y' } ),
                        new TemperatureMaxValueSpecifier( { index: 5, parser: ( v: number ): number => Math.round( v ), axeXY: 'Y' } ),
                    ] );
    
                } else {
                    this.type = 'multi';
                    this._specifierCollection = new ValueSpecifierCollection( [
                        new TimeValueSpecifier( { index: 1, axeXY: 'X' } ),
                        new TemperatureMinValueSpecifier( { index: 4, parser: ( v: number ): number => Math.round( v ), axeXY: 'Y' } ),
                        new TemperatureMeanValueSpecifier( { index: 5, parser: ( v: number ): number => Math.round( v ), axeXY: 'Y' } ),
                        new TemperatureMaxValueSpecifier( { index: 6, parser: ( v: number ): number => Math.round( v ), axeXY: 'Y' } ),
                    ] );
                }
                break;
            }

            case 'interruptions': {
                if ( searchParams.municipality_aggregation ) {
                    this.type = 'single';
                    this._specifierCollection = new ValueSpecifierCollection( [
                        new TimeValueSpecifier( { index: 0, axeXY: 'X' } ),
                        new InterruptionsValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ), axeXY: 'Y' } ),
                    ] );
                }
                else {
                    this.type = 'timeless';
                    this._specifierCollection = new ValueSpecifierCollection( [
                        new MunicipalityIdValueSpecifier( { index: 0, axeXY: 'X' } ),
                        new InterruptionsValueSpecifier( { index: 1, parser: ( v: number ): number => Math.round( v ), axeXY: 'Y' } ),
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
    
            case 'timeless': {
                this._dataHandler = new TimelessDataHandler( result, this._specifierCollection );
                break;
            }
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

export default DataHandlerFactory;