import { REST_API_BASE_URL } from '@/app/settings';

import type { SearchParamsType } from "@/types/searchParams";
import type { QueryParamsType, SavingsQueryParamsType } from "@/types/queryParams";

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
        const { from_day, to_day } = this.searchParams;
        if ( from_day && to_day ) {
            return `${from_day},${to_day}`;
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
        if ( time_aggregation && time_aggregation.includes( 'custom_year' ) ) {
            return '10-01';
        }
        return undefined
    }

    public getQueryParams(): QueryParamsType {

        const { from_date, to_date, from_day, to_day, time_aggregation }: SearchParamsType = this.searchParams;

        const qp: QueryParamsType =  {};

        if ( from_date && to_date ) qp.time_range = `${from_date},${to_date}`;
        if ( from_day && to_day ) qp.interval_filter = `${from_day},${to_day}`;
        if ( time_aggregation ) qp.time_aggregation = `${time_aggregation}`;
        if ( time_aggregation && time_aggregation.includes( 'custom_year' ) ) qp.year_start = '10-01';
    
        return qp;
    }

    abstract get url(): string;
}

class SavingsRequest extends Request { 

    public endpoint: string = 'savings';
    
    public getQueryParams(): SavingsQueryParamsType {

        const qp: SavingsQueryParamsType = super.getQueryParams();

        if ( qp.time_aggregation ) {
            qp.time_aggregation = `${qp.time_aggregation},avg`;
        }
        qp.reservoir_aggregation = `sum`;

        return qp;
    }

    public get url(): string {
        const params: string = Object.entries( this.getQueryParams() ).map( entry => `${entry[ 0 ]}=${entry[ 1 ]}` ).join( '&' );
        return `${REST_API_BASE_URL}/${this.endpoint}?${params}`;
    }
}

export { SavingsRequest };