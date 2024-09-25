import ParamValues from './ParamValues';
import SavingsParamValues from './ParamValues/SavingsParamValues';
import ProductionParamValues from './ParamValues/ProductionParamValues';

import type { ObjectType } from '@/types';
import type { SearchParamsType } from '@/types/searchParams';

type StateSettersPropsType = {
    params: { [ key: string ]: any }
    setParams: CallableFunction
}

type StateSettersResultType = { [ key: string ]: CallableFunction }

abstract class ParamHandler {    

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
                setParams( { ...params, timeAggregation, valueAggregation } )
            },
    
            setValueAggregation: ( e: React.ChangeEvent<HTMLInputElement> ): void => {
                const valueAggregation = e.target.value;
                const timeAggregation = valueAggregation ? params.timeAggregation || 'month' : '';
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

    abstract get itemsLabel(): string;
    abstract get itemsFilterKey(): string;
    abstract get itemsAggregationKey(): string;

    abstract getValueAggregationOptions( timeAggregation: string ): string[];
}

class SavingsParamHandler extends ParamHandler {

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

    get itemsLabel(): string { return 'Ταμιευτήρες'; }
    get itemsFilterKey(): string { return 'reservoirFilter'; }
    get itemsAggregationKey(): string { return 'reservoirAggregation'; }

    getValueAggregationOptions( timeAggregation: string ): string[] {
        return timeAggregation
            ? [ 'avg' ]
            : [ '' ];
    };
}

class ProductionParamHandler extends ParamHandler {

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

    get itemsLabel(): string { return 'Μονάδες επεξεργασίας'; }
    get itemsFilterKey(): string { return 'factoryFilter'; }
    get itemsAggregationKey(): string { return 'factoryAggregation'; }

    getValueAggregationOptions( timeAggregation: string ): string[] {
        return timeAggregation
            ? [ 'avg', 'sum' ]
            : [ '' ];
    };
}

class ParamHandlerFactory {

    private _paramHandler: ParamHandler | undefined;

    constructor( endpoint: string, searchParams: SearchParamsType, items: ObjectType[] ) {

        switch ( endpoint ) {

            case 'savings': {
                const paramValues: SavingsParamValues = new SavingsParamValues( searchParams, items || []  );
                this._paramHandler = new SavingsParamHandler( paramValues );
                break;
            } 
            case 'production': {
                const paramValues: ProductionParamValues = new ProductionParamValues( searchParams, items || []  );
                this._paramHandler = new ProductionParamHandler( paramValues );
                break;
            }

            default:
                throw `Invalid endpoint (${endpoint}) used in ParamHandlerFactory`;
        }
    }

    get paramHandler(): ParamHandler | undefined {
        return this._paramHandler;
    }
}

export { ParamHandler, SavingsParamHandler, ParamHandlerFactory };