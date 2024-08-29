"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import type { SavingsSearchParamsType } from "@/types/searchParams";
import type { SavingsFormParamsType } from "@/types/formParams";
import { savingsFormParamsParser } from "@/helpers/parsers/formParams";
import { savingsSearchParamsParser } from "@/helpers/parsers/searchParams";
import { SavingsSelfRequest } from "@/helpers/requests/SelfRequests";

import { 
    Form, 
    FormSectionTimeRange, FormSectionIntervalFilter, FormSectionValueAggregation, FormSectionTimeAggregation,
    FieldFromDate, FieldToDate, FieldFromMonthDay, FieldToMonthDay, FieldValueAggregation, FieldTimeAggregation
} from "@/components/Form";

import "@/styles/form.css";

type PropsType = {
    searchParams: SavingsSearchParamsType
    onSearch: boolean
}

const ParamContent = ( { searchParams, onSearch }: PropsType ) => {

    const [ formParams, setFormParams ] = useState( savingsFormParamsParser( searchParams ) );

    const setFromDate = ( e: React.ChangeEvent<HTMLInputElement> ): void => {
        setFormParams( { ...formParams, from_date: e.target.value } )
    }

    const setToDate = ( e: React.ChangeEvent<HTMLInputElement> ): void => {
        setFormParams( { ...formParams, to_date: e.target.value } )
    }

    const setFromMonthDay = ( e: React.ChangeEvent<HTMLInputElement> ): void => {
        setFormParams( { ...formParams, from_month_day: e.target.value } )
    }

    const setToMonthDay = ( e: React.ChangeEvent<HTMLInputElement> ): void => {
        setFormParams( { ...formParams, to_month_day: e.target.value } )
    }

    const setValueAggregation = ( e: React.ChangeEvent<HTMLInputElement> ): void => {
        setFormParams( { ...formParams, value_aggregation: e.target.value } )
    }

    const setTimeAggregation = ( e: React.ChangeEvent<HTMLInputElement> ): void => {
        setFormParams( { ...formParams, time_aggregation: e.target.value } )
    }

    // const router = useRouter();

    // const onClickProcess = () => {

    //     const savingsSelfRequest = new SavingsSelfRequest( savingsSearchParamsParser( formParams ) );
    //     location.href = savingsSelfRequest.url;

        // if ( chartType && chartType !== chart_type ) {    
        //     const path: string = "savings" + requestParams;
        //     router.push( path );
        // }
    // }

    useEffect( () => {
        if ( onSearch ) {
            const savingsSelfRequest = new SavingsSelfRequest( savingsSearchParamsParser( formParams ) );
            location.href = savingsSelfRequest.url;    
        }
    }, [ onSearch ] );

    console.log( "rendering: ParamContent...", formParams )

    return (
        <Form className="ParamContent">
            <FormSectionTimeRange>
                <FieldFromDate
                    value={ formParams.from_date }
                    onChange={ setFromDate }
                />
                <FieldToDate 
                    value={ formParams.to_date }
                    onChange={ setToDate }
                />
            </FormSectionTimeRange>

            <FormSectionIntervalFilter>
                <FieldFromMonthDay
                    value={ formParams.from_month_day }
                    onChange={ setFromMonthDay }
                />
                <FieldToMonthDay
                    value={ formParams.to_month_day }
                    onChange={ setToMonthDay }
                />
            </FormSectionIntervalFilter>

            <FormSectionValueAggregation>
                <FieldValueAggregation
                    value={ formParams.value_aggregation }
                    onChange={ setValueAggregation }
                />
            </FormSectionValueAggregation>

            <FormSectionTimeAggregation>
                <FieldTimeAggregation
                    value={ formParams.time_aggregation }
                    onChange={ setTimeAggregation }
                />
            </FormSectionTimeAggregation>
        </Form>
    );
}

export default ParamContent;
