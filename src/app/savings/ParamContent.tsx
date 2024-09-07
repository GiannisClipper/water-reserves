"use client"

import { useState, useEffect } from "react";

import type { SavingsSearchParamsType } from "@/types/searchParams";
import type { SavingsFormParamsType } from "@/types/formParams";
import type { RequestErrorType } from "@/types/requestResult";
import { setParamsFactory } from "@/components/Page";
import SavingsFormParams from "@/helpers/params/SavingsFormParams";

import { SavingsSelfRequest } from "@/helpers/requests/SelfRequests";

import { 
    Form, FormSectionTimeRange, 
    FormSectionIntervalFilter, 
    FormSectionAggregation, 
} from "@/components/Form";

import { 
    FieldFromDate, FieldToDate, 
    FieldFromInterval, FieldToInterval, 
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

    const {
        setFromDate, setToDate,
        setFromInterval, setToInterval,
        setTimeAggregation, setValueAggregation,

    } = setParamsFactory( { params, setParams } );

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

            <FormSectionAggregation>
                <FieldTimeAggregation
                    value={ params.timeAggregation }
                    onChange={ setTimeAggregation }
                />
                <FieldValueAggregation
                    values={ [ '', 'avg' ] }
                    value={ params.valueAggregation }
                    onChange={ setValueAggregation }
                />
            </FormSectionAggregation>
        </Form>
    );
}

export default ParamContent;
