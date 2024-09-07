"use client"

import { useState, useEffect } from "react";

import type { SavingsReservoirSearchParamsType } from "@/types/searchParams";
import type { SavingsReservoirFormParamsType } from "@/types/formParams";
import type { RequestErrorType } from "@/types/requestResult";
import SavingsReservoirFormParams from "@/helpers/params/SavingsReservoirFormParams";
import { setParamsFactory } from "@/components/Page";
import { SavingsReservoirSelfRequest } from "@/helpers/requests/SelfRequests";

import { 
    Form, FormSectionTimeRange, 
    FormSectionIntervalFilter, 
    FormSectionAggregation,
    FormSectionReservoirs,
} from "@/components/Form";

import { 
    FieldFromDate, FieldToDate, 
    FieldFromInterval, FieldToInterval, 
    FieldValueAggregation, FieldTimeAggregation,
    FieldCheckBox
} from "@/components/Field";

import "@/styles/form.css";
import "@/styles/field.css";

type PropsType = {
    searchParams: SavingsReservoirFormParamsType
    onSearch: boolean
    reservoirs: { [ key: string ]: any }[] | null
    error: RequestErrorType | null
}

const ParamContent = ( { searchParams, onSearch, reservoirs }: PropsType ) => {

    const savingsReservoirFormParams: SavingsReservoirFormParamsType = 
        new SavingsReservoirFormParams( searchParams, reservoirs || [] ).getAsObject();

    const [ params, setParams ] = useState( savingsReservoirFormParams );

    const {
        setFromDate, setToDate,
        setFromInterval, setToInterval,
        setTimeAggregation, setValueAggregation,
        setReservoirFilter,
    } = setParamsFactory( { params, setParams } );

    useEffect( () => {

        if ( onSearch ) {
            const savingsReservoirSearchParams: SavingsReservoirSearchParamsType = 
                new SavingsReservoirFormParams( searchParams, reservoirs || [] )
                    .setFromObject( params )
                    .getAsSearchObject();

            const savingsSelfRequest = new SavingsReservoirSelfRequest( savingsReservoirSearchParams );
            location.href = savingsSelfRequest.url; 
        }

    }, [ onSearch ] );

    console.log( "rendering: ParamContent..." )

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

            <FormSectionReservoirs>
                { reservoirs?.map( r => 
                    <FieldCheckBox
                        key={ r.id }
                        name={ r.id }
                        label={ r.name_en }
                        checked={ params.reservoirFilter[ r.id ] }
                        onChange={ setReservoirFilter }
                    /> 
                ) }
            </FormSectionReservoirs>
        </Form>
    );
}

export default ParamContent;
