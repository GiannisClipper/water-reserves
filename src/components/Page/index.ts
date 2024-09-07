type PropsType = {
    params: { [ key: string ]: any }
    setParams: CallableFunction
}

type ResultType = { 
    [ key: string ]: CallableFunction
}

const setParamsFactory = ( { params, setParams }: PropsType ): ResultType => {

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

        setReservoirFilter: ( e: React.ChangeEvent<HTMLInputElement> ): void => {
            const { reservoirFilter } = params;
            reservoirFilter[ e.target.name ] = e.target.checked;
            setParams( { ...params, reservoirFilter } );
        },
    }
}

export { setParamsFactory };