"use client"

import { useState, useEffect } from "react";

import type { ChartType, SavingsSearchParamsType } from "@/types/searchParams";
import type { SavingsFormParamsType } from "@/types/formParams";
import type { RequestErrorType } from "@/types/requestResult";
import BrowserParams from "@/helpers/url/BrowserUrl";
import SavingsFormParams from "@/logic/savings/params/SavingsFormParams";
import { setParamsFactory } from "@/components/Page";
import { SavingsSelfRequest } from "@/logic/_common/SelfRequests";

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
    searchParams: SavingsSearchParamsType
    onSearch: boolean
    reservoirs: { [ key: string ]: any }[] | null
    error: RequestErrorType | null
}

const ParamContent = ( { searchParams, onSearch, reservoirs }: PropsType ) => {

    console.log( "rendering: ParamContent..." )

    const savingsFormParams: SavingsFormParamsType = 
        new SavingsFormParams( searchParams, reservoirs || [] ).getAsObject();

    const [ params, setParams ] = useState( savingsFormParams );
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

            // update chartType from url
            const chartType: string | undefined = new BrowserParams( window ).getParam( 'chart_type' );
            if ( chartType ) {
                params.chartType = chartType as ChartType;
            }

            const savingsSearchParams: SavingsSearchParamsType = 
                new SavingsFormParams( searchParams, reservoirs || [] )
                    .setFromObject( params )
                    .getAsSearchObject();
        
            const savingsSelfRequest = new SavingsSelfRequest( savingsSearchParams );
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
