"use client"

import { useState } from "react";

import { Form, FormSection, FormButtonMore, FormButtonLess } from "@/components/Form";

import { 
    FieldFromDate, FieldToDate, 
    FieldFromInterval, FieldToInterval, 
    FieldValueAggregation, FieldTimeAggregation,
} from "@/components/Field";

import { ParamHandler, ParamHandlerFactory } from "@/logic/ParamHandler";
import usePageRequest from "@/logic/usePageRequest";

import type { SearchParamsType } from "@/types/searchParams";
import type { RequestErrorType } from "@/types/requestResult";

import "@/styles/form.css";
import "@/styles/field.css";

type PropsType = {
    endpoint: string
    searchParams: SearchParamsType
    onPageRequest: boolean
    error: RequestErrorType | null
}

const ParamContent = ( { endpoint, searchParams, onPageRequest }: PropsType ) => {

    const paramHandler: ParamHandler = new ParamHandlerFactory( endpoint, searchParams ).paramHandler;

    const [ params, setParams ] = useState( paramHandler.paramValues.toJSON() );
    const {
        setFromDate, setToDate,
        setFromInterval, setToInterval,
        setTimeAggregation, setValueAggregation,
    } = paramHandler.Class.getStateSetters( { params, setParams } );

    const [ showMore, setShowMore ] = useState( false );
    const setMore = () => setShowMore( true );
    const setLess = () => setShowMore( false );

    console.log( "rendering: ParamContent...", params );

    usePageRequest( { onPageRequest, params, paramHandler } );

    return (
        <Form className="ParamContent">

            <FormSection label="Περίοδος δεδομένων">
                <FieldFromDate
                    value={ params.fromDate }
                    onChange={ setFromDate }
                />
                <FieldToDate 
                    value={ params.toDate }
                    onChange={ setToDate }
                />
                <FieldTimeAggregation
                    values={ paramHandler.getTimeAggregationOptions() }
                    value={ params.timeAggregation }
                    onChange={ setTimeAggregation }
                />
            </FormSection>

            { showMore
                ? <FormButtonLess onClick={ setLess } />
                : <FormButtonMore onClick={ setMore } />
            }

            { showMore
                ?
                <FormSection label="Παράθυρο ενδιαφέροντος">
                    <FieldFromInterval
                        value={ params.fromInterval }
                        onChange={ setFromInterval }
                    />
                    <FieldToInterval
                        value={ params.toInterval }
                        onChange={ setToInterval }
                    />
                </FormSection>
                :
                null
            }

        </Form>
    );
}

export default ParamContent;
