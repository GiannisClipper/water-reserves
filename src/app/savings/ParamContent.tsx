"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
    Form, 
    FormSectionTimeRange, FormSectionIntervalFilter, FormSectionTimeAggregation,
    FieldFromDate, FieldToDate, FieldFromMonthDay, FieldToMonthDay, FieldTimeAggregation
} from "@/components/Form";
import type { SearchParamsType } from "@/types/searchParams";
import { SavingsSelfRequest } from "@/helpers/SelfRequests";

type PropsType = {
    searchParams: SearchParamsType
}

const ParamContent = ( { searchParams }: PropsType ) => {

    const [ params, setParams ] = useState( searchParams || {} );

    const setFromDate = ( e: React.ChangeEvent<HTMLInputElement> ): void => {
        setParams( { ...params, from_date: e.target.value } )
    }

    const setToDate = ( e: React.ChangeEvent<HTMLInputElement> ): void => {
        setParams( { ...params, to_date: e.target.value } )
    }

    const setFromMonthDay = ( e: React.ChangeEvent<HTMLInputElement> ): void => {
        setParams( { ...params, from_month_day: e.target.value } )
    }

    const setToMonthDay = ( e: React.ChangeEvent<HTMLInputElement> ): void => {
        setParams( { ...params, to_month_day: e.target.value } )
    }

    const setTimeAggregation = ( e: React.ChangeEvent<HTMLInputElement> ): void => {
        setParams( { ...params, time_aggregation: e.target.value } )
    }

    const router = useRouter();

    const onClickProcess = () => {

        const savingsSelfRequest = new SavingsSelfRequest( params );
        location.href = savingsSelfRequest.url;

        // if ( chartType && chartType !== chart_type ) {    
        //     const path: string = "savings" + requestParams;
        //     router.push( path );
        // }
    }

    console.log( "rendering: ParamContent..." )

    return (
        <Form className="ParamContent">
            <FormSectionTimeRange>
                <FieldFromDate
                    value={ params.from_date }
                    onChange={ setFromDate }
                />
                <FieldToDate 
                    value={ params.to_date }
                    onChange={ setToDate }
                />
            </FormSectionTimeRange>

            <FormSectionIntervalFilter>
                <FieldFromMonthDay
                    value={ params.from_month_day }
                    onChange={ setFromMonthDay }
                />
                <FieldToMonthDay
                    value={ params.to_month_day }
                    onChange={ setToMonthDay }
                />
            </FormSectionIntervalFilter>

            <FormSectionTimeAggregation>
                <FieldTimeAggregation
                    value={ params.time_aggregation }
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
