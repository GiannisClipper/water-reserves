import { isYearMonthDay } from '@/helpers/input/yearMonthDay';
import type { ObjectType } from '@/types';

type ErrorType = { message: string };

class Time {

    year: number;
    month: number;
    day: number;

    constructor( value: string ) {
        if ( ! value || ! isYearMonthDay( value ) ) {
            this.year = 0;
            this.month = 0;
            this.day = 0;
            return;
        }

        const parts: number[] = value.split( '-' ).map( v => parseInt( v ) ).concat( [ 0, 0 ] );
        this.year = parts[ 0 ];
        this.month = parts[ 1 ];
        this.day = parts[ 2 ];
    }
}

class TimeRange {

    fromTime: Time;
    toTime: Time;

    constructor( value: string ) {
        if ( ! value ) {
            value = '';
        }

        const parts: string[] = value.split( ',' ).concat( [ '' ] );

        this.fromTime = new Time( parts[ 0 ] );
        this.toTime = new Time( parts[ 1 ] );
    }

    get years() {
        if ( this.fromTime.year && this.toTime.year ) {
            return this.toTime.year - this.fromTime.year  + 1;
        }
        if ( this.fromTime.year || this.toTime.year ) {
            return 1;
        }
        return 0;
    }

    get months() {
        let result: number = this.years * 12;
        if ( this.fromTime.month ) {
            result -= ( this.fromTime.month - 1 );
        }
        if ( this.toTime.month ) {
            result -= ( 12 - this.toTime.month );
        }
        return result;
    }
}

class ParamValidation {    

    time_range: string | undefined;
    time_aggregation: string | undefined;

    constructor( searchParams: ObjectType ) {
        this.time_range = searchParams.time_range;
        this.time_aggregation = searchParams.time_aggregation && searchParams.time_aggregation.split( ',' )[ 0 ];
    }

    validate(): ErrorType | null {

        if ( ! this.time_range ) {
            const error: ErrorType = { message: "No time range has been defined, please fill in the time range." };
            return error;
        }

        const timeRange = new TimeRange( this.time_range );

        if ( timeRange.months > 10 * 12 ) {
            if ( ! this.time_aggregation ) {
                const error: ErrorType = { message: "No daily representation longer than 1 year is supported, please select a yearly representation." };
                return error;
            }
            if ( this.time_aggregation === 'month' ) {
                const error: ErrorType = { message: "No monthly representation longer than 10 years is supported, please select a yearly representation." };
                return error;
            }
        }

        if ( timeRange.months > 12 ) {
            if ( ! this.time_aggregation ) {
                const error: ErrorType = { message: "No daily representation longer than 1 year is supported, please select a monthly or yearly representation." };
                return error;
            }
        }

        return null;
    };
}

export { ParamValidation };