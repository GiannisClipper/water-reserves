import SavingsParamValues from './ParamValues/SavingsParamValues';

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
    
            setReservoirAggregation: ( e: React.ChangeEvent<HTMLInputElement> ): void => {
                setParams( { ...params, reservoirAggregation: e.target.value } )
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
    
            setReservoirFilter: ( e: React.ChangeEvent<HTMLInputElement> ): void => {
                console.log( 'setReservoirFilter' )
                const { reservoirFilter } = params;
                reservoirFilter[ e.target.name ] = e.target.checked;
                setParams( { ...params, reservoirFilter } );
            },
        }
    } 

    constructor() {}
}

class SavingsParamHandler extends ParamHandler {

    static getStateSetters( { params, setParams }: StateSettersPropsType ): StateSettersResultType {

        return {
            ...super.getStateSetters( { params, setParams } ),

            setReservoirAggregation: ( e: React.ChangeEvent<HTMLInputElement> ): void => {
                setParams( { ...params, reservoirAggregation: e.target.value } )
            },
    
            setReservoirFilter: ( e: React.ChangeEvent<HTMLInputElement> ): void => {
                const { reservoirFilter } = params;
                reservoirFilter[ e.target.name ] = e.target.checked;
                setParams( { ...params, reservoirFilter } );
            },
        }
    }

    _paramValues: SavingsParamValues;

    constructor( paramValues: SavingsParamValues ) {
        super();
        this._paramValues = paramValues;
    };

    get paramValues(): SavingsParamValues {
        return this._paramValues;
    }
}


export { ParamHandler, SavingsParamHandler };