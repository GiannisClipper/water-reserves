import { REST_API_BASE_URL } from '@/app/settings';

import type { SearchParamsType } from "@/types/searchParams";
import type { RequestParamsType, SavingsRequestParamsType } from "@/types/requestParams";

abstract class Request {

    public searchParams: SearchParamsType;
    
    constructor( searchParams: SearchParamsType ) {
        this.searchParams = searchParams;
    }

    public get time_range(): string | undefined {
        const { from_date, to_date } = this.searchParams;
        if ( from_date && to_date ) {
            return `${from_date},${to_date}`;
        }
        return undefined
    }

    public get interval_filter(): string | undefined {
        const { from_month_day, to_month_day } = this.searchParams;
        if ( from_month_day && to_month_day ) {
            return `${from_month_day},${to_month_day}`;
        }
        return undefined
    }

    public get time_aggregation(): string | undefined {
        const { time_aggregation } = this.searchParams;
        if ( time_aggregation ) {
            return time_aggregation;
        }
        return undefined
    }

    public get year_start(): string | undefined {
        const { time_aggregation } = this.searchParams;
        if ( time_aggregation && time_aggregation ) {
            return '10-01';
        }
        return undefined
    }

    public getRequestParams(): RequestParamsType {

        const { from_date, to_date, from_month_day, to_month_day, time_aggregation }: SearchParamsType = this.searchParams;

        const rp: RequestParamsType =  {};

        if ( from_date && to_date ) rp.time_range = `${from_date},${to_date}`;
        if ( from_month_day && to_month_day ) rp.interval_filter = `${from_month_day},${to_month_day}`;
        if ( time_aggregation ) rp.time_aggregation = `${time_aggregation}`;
        if ( time_aggregation && time_aggregation.includes( 'custom_year' ) ) rp.year_start = '10-01';
    
        return rp;
    }

    abstract get url(): string;
}

class SavingsRequest extends Request { 

    public endpoint: string = 'savings';
    
    public getRequestParams(): SavingsRequestParamsType {

        const rp: SavingsRequestParamsType = super.getRequestParams();

        if ( rp.time_aggregation ) {
            rp.time_aggregation = `${rp.time_aggregation},avg`;
        }
        rp.reservoir_aggregation = `sum`;

        return rp;
    }

    public get url(): string {
        const params: string = Object.entries( this.getRequestParams() ).map( entry => `${entry[ 0 ]}=${entry[ 1 ]}` ).join( '&' );
        return `${REST_API_BASE_URL}/${this.endpoint}?${params}`;
    }
}

export { SavingsRequest };