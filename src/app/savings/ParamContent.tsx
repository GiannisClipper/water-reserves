"use client"

import { useState, useEffect } from "react";

import type { SavingsSearchParamsType } from "@/types/searchParams";
import type { SavingsFormParamsType } from "@/types/formParams";
import type { RequestErrorType } from "@/types/requestResult";
import SavingsFormParams from "@/helpers/params/SavingsFormParams";

import { SavingsSelfRequest } from "@/helpers/requests/SelfRequests";

import { 
    Form, FormSectionTimeRange, FormSectionIntervalFilter, 
    FormSectionTimeAggregation, FormSectionValueAggregation, 
} from "@/components/Form";

import { 
    FieldFromDate, FieldToDate, FieldFromInterval, FieldToInterval, 
    FieldTimeAggregation, FieldValueAggregation, 
} from "@/components/Field";


import "@/styles/form.css";
import "@/styles/field.css";

type PropsType = {
    searchParams: SavingsSearchParamsType
    onSearch: boolean
    error: RequestErrorType | null
}

const ParamContent = ( { searchParams, onSearch }: PropsType ) => {

    const savingsFormParams: SavingsFormParamsType = 
        new SavingsFormParams( searchParams ).getAsObject();

    const [ params, setParams ] = useState( savingsFormParams );

    const setFromDate = ( e: React.ChangeEvent<HTMLInputElement> ): void => {
        setParams( { ...params, fromDate: e.target.value } )
    }

    const setToDate = ( e: React.ChangeEvent<HTMLInputElement> ): void => {
        setParams( { ...params, toDate: e.target.value } )
    }

    const setFromInterval = ( e: React.ChangeEvent<HTMLInputElement> ): void => {
        setParams( { ...params, fromInterval: e.target.value } )
    }

    const setToInterval = ( e: React.ChangeEvent<HTMLInputElement> ): void => {
        setParams( { ...params, toInterval: e.target.value } )
    }

    const setTimeAggregation = ( e: React.ChangeEvent<HTMLInputElement> ): void => {
        const timeAggregation = e.target.value;
        const valueAggregation = timeAggregation ? params.valueAggregation || 'avg' : '';
        setParams( { ...params, timeAggregation, valueAggregation } )
    }

    const setValueAggregation = ( e: React.ChangeEvent<HTMLInputElement> ): void => {
        const valueAggregation = e.target.value;
        const timeAggregation = valueAggregation ? params.timeAggregation || 'month' : '';
        setParams( { ...params, timeAggregation, valueAggregation } )
    }

    useEffect( () => {

        if ( onSearch ) {
            const savingsSearchParams: SavingsSearchParamsType = 
                new SavingsFormParams( searchParams )
                    .setFromObject( params )
                    .getAsSearchObject();

            const savingsSelfRequest = new SavingsSelfRequest( savingsSearchParams );
            location.href = savingsSelfRequest.url; 
        }

    }, [ onSearch ] );

    console.log( "rendering: ParamContent...", params )

    return (
        <Form className="ParamContent">
            <FormSectionTimeRange>
                <FieldFromDate
                    value={ params.fromDate }
                    onChange={ setFromDate }
                />
                <FieldToDate 
                    value={ params.toDate }
                    onChange={ setToDate }
                />
            </FormSectionTimeRange>

            <FormSectionIntervalFilter>
                <FieldFromInterval
                    value={ params.fromInterval }
                    onChange={ setFromInterval }
                />
                <FieldToInterval
                    value={ params.toInterval }
                    onChange={ setToInterval }
                />
            </FormSectionIntervalFilter>

            <FormSectionTimeAggregation>
                <FieldTimeAggregation
                    value={ params.timeAggregation }
                    onChange={ setTimeAggregation }
                />
            </FormSectionTimeAggregation>

            <FormSectionValueAggregation>
                <FieldValueAggregation
                    values={ [ '', 'avg' ] }
                    value={ params.valueAggregation }
                    onChange={ setValueAggregation }
                />
            </FormSectionValueAggregation>
        </Form>
    );
}

export default ParamContent;
