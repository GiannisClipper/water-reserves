"use client"

import { useState, useEffect } from "react";

import type { SavingsReservoirSearchParamsType } from "@/types/searchParams";
import type { SavingsReservoirFormParamsType } from "@/types/formParams";
import type { RequestErrorType } from "@/types/requestResult";
import SavingsReservoirFormParams from "@/logic/savings-reservoir/params/SavingsReservoirFormParams";
import { setParamsFactory } from "@/components/Page";
import { SavingsReservoirSelfRequest } from "@/logic/_common/SelfRequests";

import { 
    Form, FormSectionTimeRange, 
    FormSectionIntervalFilter, 
    FormSectionAggregation,
    FormSectionReservoirs,
    FormButtonMore,
    FormButtonLess
} from "@/components/Form";

import { 
    FieldFromDate, FieldToDate, 
    FieldFromInterval, FieldToInterval, 
    FieldReservoirAggregation, FieldValueAggregation, FieldTimeAggregation,
    CheckField
} from "@/components/Field";

import "@/styles/form.css";
import "@/styles/field.css";

type PropsType = {
    searchParams: SavingsReservoirSearchParamsType
    onSearch: boolean
    reservoirs: { [ key: string ]: any }[] | null
    error: RequestErrorType | null
}

const ParamContent = ( { searchParams, onSearch, reservoirs }: PropsType ) => {

    console.log( "rendering: ParamContent..." )

    const savingsReservoirFormParams: SavingsReservoirFormParamsType = 
        new SavingsReservoirFormParams( searchParams, reservoirs || [] ).getAsObject();

    const [ params, setParams ] = useState( savingsReservoirFormParams );
    const {
        setFromDate, setToDate,
        setFromInterval, setToInterval,
        setReservoirAggregation, setTimeAggregation, setValueAggregation,
        setReservoirFilter,
    } = setParamsFactory( { params, setParams } );

    const [ showMore, setShowMore ] = useState( false );
    const setMore = () => setShowMore( true );
    const setLess = () => setShowMore( false );

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
                <FieldTimeAggregation
                    value={ params.timeAggregation }
                    onChange={ setTimeAggregation }
                />
                <FieldValueAggregation
                    values={ [ '', 'avg' ] }
                    value={ params.valueAggregation }
                    onChange={ setValueAggregation }
                />

            </FormSectionTimeRange>

            <FormSectionReservoirs>
                { reservoirs?.map( r => 
                    <CheckField
                        key={ r.id }
                        name={ r.id }
                        label={ r.name_el }
                        checked={ params.reservoirFilter[ r.id ] }
                        onChange={ setReservoirFilter }
                    /> 
                ) }
                <FieldReservoirAggregation
                    values={ [ '', 'sum' ] }
                    value={ params.reservoirAggregation }
                    onChange={ setReservoirAggregation }
                />

            </FormSectionReservoirs>

            { showMore
                ? <FormButtonLess onClick={ setLess } />
                : <FormButtonMore onClick={ setMore } />
            }

            { showMore
                ?
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
                :
                null
            }

        </Form>
    );
}

export default ParamContent;
