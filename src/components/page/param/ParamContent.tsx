"use client"

import { useState, useEffect } from "react";

import { Form, FormSection, FormButtonMore, FormButtonLess } from "@/components/Form";

import { 
    FieldFromDate, FieldToDate, 
    FieldFromInterval, FieldToInterval, 
    FieldItemsAggregation, FieldValueAggregation, FieldTimeAggregation,
    CheckField
} from "@/components/Field";

import { ParamHandler, ParamHandlerFactory } from "@/logic/ParamHandler";
import BrowserUrl from "@/helpers/url/BrowserUrl";

import type { ObjectType } from "@/types";
import type { ChartType, SearchParamsType } from "@/types/searchParams";
import type { RequestErrorType } from "@/types/requestResult";

import "@/styles/form.css";
import "@/styles/field.css";

type PropsType = {
    endpoint: string
    searchParams: SearchParamsType
    onSearch: boolean
    items: ObjectType[]
    error: RequestErrorType | null
}

const ParamContent = ( { endpoint, searchParams, onSearch, items }: PropsType ) => {

    console.log( "rendering: ParamContent..." )

    const paramHandler: ParamHandler = new ParamHandlerFactory( endpoint, searchParams, items ).paramHandler;

    const [ params, setParams ] = useState( paramHandler.paramValues.toJSON() );
    const {
        setFromDate, setToDate,
        setFromInterval, setToInterval,
        setItemsAggregation, 
        setTimeAggregation, setValueAggregation,
        setItemsFilter,
    } = paramHandler.Class.getStateSetters( { params, setParams } );

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
            const queryString: string = paramHandler.paramValues
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
                    values={ paramHandler.getValueAggregationOptions( params.timeAggregation ) }
                    value={ params.valueAggregation }
                    onChange={ setValueAggregation }
                />

            </FormSection>

            <FormSection label={ paramHandler.itemsLabel }>
                { items?.map( r => 
                    <CheckField
                        key={ r.id }
                        name={ r.id }
                        label={ r.name_el }
                        checked={ params[ paramHandler.itemsFilterKey ][ r.id ] }
                        onChange={ setItemsFilter }
                    /> 
                ) }
                <FieldItemsAggregation
                    values={ [ '', 'sum' ] }
                    value={ params[ paramHandler.itemsAggregationKey ] }
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
