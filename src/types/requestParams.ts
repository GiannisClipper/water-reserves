interface RequestParamsType {
    time_range?: string
    interval_filter?: string
    time_aggregation?: string
    year_start?: string
}

interface SavingsRequestParamsType extends RequestParamsType {
    reservoir_aggregation?: 'sum' 
}

export type { RequestParamsType, SavingsRequestParamsType };