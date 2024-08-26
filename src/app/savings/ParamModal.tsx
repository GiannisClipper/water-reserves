"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/Modal";
import { 
    Form, 
    FormSectionTimeRange, FormSectionIntervalFilter,
    FieldFromDate, FieldToDate, FieldFromMonthDay, FieldToMonthDay
} from "@/components/Form";
import type { SearchParamsType } from "@/types/searchParams";
import { SavingsSelfRequest } from "@/helpers/SelfRequests";

type PropsType = {
    onClose: () => void
    searchParams: SearchParamsType
}

export default function ParamModal( { onClose, searchParams }: PropsType ) {

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

    const router = useRouter();

    const onClickProcess = () => {

        const savingsSelfRequest = new SavingsSelfRequest( params );
        location.href = savingsSelfRequest.url;

        // if ( chartType && chartType !== chart_type ) {    
        //     const path: string = "savings" + requestParams;
        //     router.push( path );
        // }
    }

    console.log( "rendering: ParamModal..." )

    return (
        <Modal onClose={ onClose }>
            <Form className="ParamModal">
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

                <div>
                    <button
                        onClick={ e => onClickProcess() }
                    >
                        Process params
                    </button>
                </div>
            </Form>
        </Modal>
    );
}
