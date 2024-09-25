"use client"

import { useState, useEffect } from "react";

import { Form, FormSection, FormButtonMore, FormButtonLess } from "@/components/Form";

import { 
    FieldFromDate, FieldToDate, 
    FieldFromInterval, FieldToInterval, 
    FieldItemsAggregation, FieldValueAggregation, FieldTimeAggregation,
    CheckField
} from "@/components/Field";

import SavingsParamValues from "@/logic/_common/ParamValues/SavingsParamValues";
import { SavingsParamHandler } from "@/logic/_common/ParamHandler";
import BrowserUrl from "@/helpers/url/BrowserUrl";

import type { ChartType, SavingsSearchParamsType } from "@/types/searchParams";
import type { RequestErrorType } from "@/types/requestResult";

import "@/styles/form.css";
import "@/styles/field.css";

type PropsType = {
    endpoint: string
    searchParams: SavingsSearchParamsType
    onSearch: boolean
    items: { [ key: string ]: any }[] | null
    error: RequestErrorType | null
}

const ParamContent = ( { endpoint, searchParams, onSearch, items }: PropsType ) => {

    console.log( "rendering: ParamContent..." )

    const paramValues: SavingsParamValues = new SavingsParamValues( searchParams, items || []  );
    const paramHandler: SavingsParamHandler = new SavingsParamHandler( paramValues );

    const [ params, setParams ] = useState( paramHandler.paramValues.toJSON() );
    const {
        setFromDate, setToDate,
        setFromInterval, setToInterval,
        setReservoirAggregation: setItemsAggregation, 
        setTimeAggregation, setValueAggregation,
        setReservoirFilter: setItemsFilter,
    } = SavingsParamHandler.getStateSetters( { params, setParams } );

    const [ showMore, setShowMore ] = useState( false );
    const setMore = () => setShowMore( true );
    const setLess = () => setShowMore( false );

    useEffect( () => {

        if ( onSearch ) {

            const url: BrowserUrl = new BrowserUrl( window );

            // update chartType from url
            const chartType: string | undefined = url.getParam( 'chart_type' );
            if ( chartType ) {
                params.chartType = chartType as ChartType;
            }

            // convert form params to query string
            const queryString: string = new SavingsParamValues( searchParams, items || [] )
                .fromJSON( params )
                .toQueryString();

            // update browser url and request page
            url.setParams( queryString.split( '&' ) );
            url.open();
        }

    }, [ onSearch ] );

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
                    value={ params.timeAggregation }
                    onChange={ setTimeAggregation }
                />
                <FieldValueAggregation
                    values={ [ '', 'avg' ] }
                    value={ params.valueAggregation }
                    onChange={ setValueAggregation }
                />

            </FormSection>

            <FormSection label="Ταμιευτήρες">
                { items?.map( r => 
                    <CheckField
                        key={ r.id }
                        name={ r.id }
                        label={ r.name_el }
                        checked={ params.reservoirFilter[ r.id ] }
                        onChange={ setItemsFilter }
                    /> 
                ) }
                <FieldItemsAggregation
                    values={ [ '', 'sum' ] }
                    value={ params.reservoirAggregation }
                    onChange={ setItemsAggregation }
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
