"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { SavingsSearchParamsType } from "@/types/searchParams";
import type { SavingsFormParamsType } from "@/types/formParams";
import { savingsFormParamsParser } from "@/helpers/parsers/formParams";
import { savingsSearchParamsParser } from "@/helpers/parsers/searchParams";
import { SavingsSelfRequest } from "@/helpers/requests/SelfRequests";

import { 
    Form, 
    FormSectionTimeRange, FormSectionIntervalFilter, FormSectionTimeAggregation,
    FieldFromDate, FieldToDate, FieldFromMonthDay, FieldToMonthDay, FieldTimeAggregation
} from "@/components/Form";

type PropsType = {
    searchParams: SavingsSearchParamsType
}

const ParamContent = ( { searchParams }: PropsType ) => {

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

    const setTimeAggregation = ( e: React.ChangeEvent<HTMLInputElement> ): void => {
        setFormParams( { ...formParams, time_aggregation: e.target.value } )
    }

    const router = useRouter();

    const onClickProcess = () => {

        const savingsSelfRequest = new SavingsSelfRequest( savingsSearchParamsParser( formParams ) );
        location.href = savingsSelfRequest.url;

        // if ( chartType && chartType !== chart_type ) {    
        //     const path: string = "savings" + requestParams;
        //     router.push( path );
        // }
    }

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

            <FormSectionTimeAggregation>
                <FieldTimeAggregation
                    value={ formParams.time_aggregation }
                    onChange={ setTimeAggregation }
                />
            </FormSectionTimeAggregation>

            <div>
                <button
                    onClick={ e => onClickProcess() }
                >
                    Process params
                </button>
            </div>
        </Form>
    );
}

export default ParamContent;
