import SavingsParamValues from './ParamValues/SavingsParamValues';
import ProductionParamValues from './ParamValues/ProductionParamValues';
import WeatherParamValues from './ParamValues/WeatherParamValues';
import TemperatureParamValues from './ParamValues/TemperatureParamValues';
import { ParamValues, SavingsProductionParamValues, SavingsPrecipitationParamValues } from './ParamValues';

import type { ObjectType } from '@/types';
import type { SearchParamsType } from '@/types/searchParams';
import InterruptionsParamValues from './ParamValues/InterruptionsParamValues';

type StateSettersPropsType = {
    params: { [ key: string ]: any }
    setParams: CallableFunction
}

type StateSettersResultType = { [ key: string ]: CallableFunction }

class ParamHandler {

    static getStateSetters( { params, setParams }: StateSettersPropsType ): StateSettersResultType {

        return {
            setFromDate: ( e: React.ChangeEvent<HTMLInputElement> ): void => {
                setParams( { ...params, fromDate: e.target.value } )
            },
    
            setToDate: ( e: React.ChangeEvent<HTMLInputElement> ): void => {
                setParams( { ...params, toDate: e.target.value } )
            },
    
            setFromInterval: ( e: React.ChangeEvent<HTMLInputElement> ): void => {
                setParams( { ...params, fromInterval: e.target.value } )
            },
    
            setToInterval: ( e: React.ChangeEvent<HTMLInputElement> ): void => {
                setParams( { ...params, toInterval: e.target.value } )
            },
        
            setTimeAggregation: ( e: React.ChangeEvent<HTMLInputElement> ): void => {
                const timeAggregation = e.target.value;
                const valueAggregation = timeAggregation ? params.valueAggregation || 'avg' : '';
                // console.log( timeAggregation, valueAggregation );
                setParams( { ...params, timeAggregation, valueAggregation } )
            },
    
            setValueAggregation: ( e: React.ChangeEvent<HTMLInputElement> ): void => {
                const valueAggregation = e.target.value;
                const timeAggregation = valueAggregation ? params.timeAggregation || 'month' : '';
                // console.log( timeAggregation, valueAggregation );
                setParams( { ...params, timeAggregation, valueAggregation } )
            },
        }
    } 

    public Class = ParamHandler;

    private _paramValues: ParamValues;

    constructor( paramValues: ParamValues ) {
        this._paramValues = paramValues;
    };

    get paramValues(): ParamValues {
        return this._paramValues;
    }

    public getTimeAggregationOptions(): string[] {
        return [ '', 'month', 'year', 'custom_year' ];
    }

    public getValueAggregationOptions( timeAggregation: string ): string[] {
        return timeAggregation
            ? [ 'avg', 'sum' ]
            : [ '' ];
    }
}

abstract class ParamHandlerWithItems extends ParamHandler {

    abstract get itemsLabel(): string;
    abstract get itemsFilterKey(): string;
    abstract get itemsAggregationKey(): string;
}

class SavingsParamHandler extends ParamHandlerWithItems {

    static getStateSetters( { params, setParams }: StateSettersPropsType ): StateSettersResultType {

        return {
            ...super.getStateSetters( { params, setParams } ),

            setItemsAggregation: ( e: React.ChangeEvent<HTMLInputElement> ): void => {
                setParams( { ...params, reservoirAggregation: e.target.value } )
            },
    
            setItemsFilter: ( e: React.ChangeEvent<HTMLInputElement> ): void => {
                const { reservoirFilter } = params;
                reservoirFilter[ e.target.name ] = e.target.checked;
                setParams( { ...params, reservoirFilter } );
            },
        }
    }

    public Class = SavingsParamHandler;

    get itemsLabel(): string { return 'Reservoirs'; }
    get itemsFilterKey(): string { return 'reservoirFilter'; }
    get itemsAggregationKey(): string { return 'reservoirAggregation'; }

    getValueAggregationOptions( timeAggregation: string ): string[] {
        return timeAggregation
            ? [ 'avg' ]
            : [ '' ];
    };
}

class ProductionParamHandler extends ParamHandlerWithItems {

    static getStateSetters( { params, setParams }: StateSettersPropsType ): StateSettersResultType {

        return {
            ...super.getStateSetters( { params, setParams } ),

            setItemsAggregation: ( e: React.ChangeEvent<HTMLInputElement> ): void => {
                setParams( { ...params, factoryAggregation: e.target.value } )
            },
    
            setItemsFilter: ( e: React.ChangeEvent<HTMLInputElement> ): void => {
                const { factoryFilter } = params;
                factoryFilter[ e.target.name ] = e.target.checked;
                setParams( { ...params, factoryFilter } );
            },
        }
    }

    public Class = ProductionParamHandler;

    get itemsLabel(): string { return 'Plants'; }
    get itemsFilterKey(): string { return 'factoryFilter'; }
    get itemsAggregationKey(): string { return 'factoryAggregation'; }

    getValueAggregationOptions( timeAggregation: string ): string[] {
        return timeAggregation
            ? [ 'avg', 'sum' ]
            : [ '' ];
    };
}

class PrecipitationParamHandler extends ParamHandlerWithItems {

    static getStateSetters( { params, setParams }: StateSettersPropsType ): StateSettersResultType {

        return {
            ...super.getStateSetters( { params, setParams } ),

            setTimeAggregation: ( e: React.ChangeEvent<HTMLInputElement> ): void => {
                const timeAggregation = e.target.value;
                const valueAggregation = timeAggregation ? params.valueAggregation || 'sum' : '';
                setParams( { ...params, timeAggregation, valueAggregation } )
            },

            setItemsAggregation: ( e: React.ChangeEvent<HTMLInputElement> ): void => {
                setParams( { ...params, locationAggregation: e.target.value } )
            },
    
            setItemsFilter: ( e: React.ChangeEvent<HTMLInputElement> ): void => {
                const { locationFilter } = params;
                locationFilter[ e.target.name ] = e.target.checked;
                setParams( { ...params, locationFilter } );
            },
        }
    }

    public Class = PrecipitationParamHandler;

    get itemsLabel(): string { return 'Locations'; }
    get itemsFilterKey(): string { return 'locationFilter'; }
    get itemsAggregationKey(): string { return 'locationAggregation'; }

    getValueAggregationOptions( timeAggregation: string ): string[] {
        return timeAggregation
            ? [ 'sum' ]
            : [ '' ];
    };
}

class TemperatureParamHandler extends ParamHandler {

    static getStateSetters( { params, setParams }: StateSettersPropsType ): StateSettersResultType {

        return {
            ...super.getStateSetters( { params, setParams } ),

            setTimeAggregation: ( e: React.ChangeEvent<HTMLInputElement> ): void => {
                const timeAggregation = e.target.value;
                const valueAggregation = timeAggregation ? params.valueAggregation || 'avg' : '';
                setParams( { ...params, timeAggregation, valueAggregation } )
            },
        }
    }

    public Class = TemperatureParamHandler;

    getValueAggregationOptions( timeAggregation: string ): string[] {
        return timeAggregation
            ? [ 'avg' ]
            : [ '' ];
    };
}

class InterruptionsParamHandler extends ParamHandler {

    static getStateSetters( { params, setParams }: StateSettersPropsType ): StateSettersResultType {

        return {
            ...super.getStateSetters( { params, setParams } ),

            setTimeAggregation: ( e: React.ChangeEvent<HTMLInputElement> ): void => {
                const timeAggregation = e.target.value;
                const valueAggregation = timeAggregation ? params.valueAggregation || 'sum' : '';
                setParams( { ...params, timeAggregation, valueAggregation } );
            },
        }
    }

    public Class = InterruptionsParamHandler;

    // get itemsLabel(): string { return 'Δήμοι Αττικής'; }
    // get itemsAggregationKey(): string { return 'municipalityAggregation'; }

    getTimeAggregationOptions(): string[] {
        return [ '', 'month', 'year', 'custom_year', 'alltime' ];
    };

    getValueAggregationOptions( timeAggregation: string ): string[] {
        return timeAggregation === 'alltime'
            ? [ 'sum', 'sum,over-area', 'sum,over-population' ]
            : [ 'sum' ];
    };
}

class SavingsProductionParamHandler extends ParamHandler {

    public Class = SavingsProductionParamHandler;

    getTimeAggregationOptions(): string[] {
        return [ 'month', 'year', 'custom_year' ];
    };

    getValueAggregationOptions(): string[] {
        return [ 'growth' ];
    };
}

class SavingsPrecipitationParamHandler extends ParamHandler {

    public Class = SavingsPrecipitationParamHandler;

    getTimeAggregationOptions(): string[] {
        return [ 'month', 'year', 'custom_year' ];
    };

    getValueAggregationOptions(): string[] {
        return [ 'growth' ];
    };
}

class ParamHandlerFactory {

    private _paramHandler: ParamHandler | ParamHandlerWithItems;

    constructor( endpoint: string, searchParams: SearchParamsType, items?: ObjectType[] ) {

        switch ( endpoint ) {

            case 'savings': {
                const paramValues = new SavingsParamValues( searchParams, items || [] );
                this._paramHandler = new SavingsParamHandler( paramValues );
                break;
            } 
            case 'production': {
                const paramValues = new ProductionParamValues( searchParams, items || [] );
                this._paramHandler = new ProductionParamHandler( paramValues );
                break;
            }
            case 'precipitation': {
                const paramValues = new WeatherParamValues( searchParams, items || [] );
                this._paramHandler = new PrecipitationParamHandler( paramValues );
                break;
            }
            case 'temperature': {
                const paramValues = new TemperatureParamValues( searchParams, items || [] );
                this._paramHandler = new TemperatureParamHandler( paramValues );
                break;
            }
            case 'interruptions': {
                const paramValues = new InterruptionsParamValues( searchParams, items || [] );
                this._paramHandler = new InterruptionsParamHandler( paramValues );
                break;
            }
            case 'savings-production': {
                const paramValues = new SavingsProductionParamValues( searchParams );
                this._paramHandler = new SavingsProductionParamHandler( paramValues );
                break;
            } 
            case 'savings-precipitation': {
                const paramValues = new SavingsPrecipitationParamValues( searchParams );
                this._paramHandler = new SavingsPrecipitationParamHandler( paramValues );
                break;
            } 

            default:
                throw `Invalid endpoint (${endpoint}) used in ParamHandlerFactory`;
        }
    }

    get paramHandler(): ParamHandler | ParamHandlerWithItems {
        return this._paramHandler;
    }
}

export { ParamHandler, ParamHandlerWithItems, ParamHandlerFactory };