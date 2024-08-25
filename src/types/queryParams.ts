interface QueryParamsType {
    time_range?: string
    interval_filter?: string
    time_aggregation?: string
    year_start?: string
}

interface SavingsQueryParamsType extends QueryParamsType {
    reservoir_aggregation?: string 
}

export type { QueryParamsType, SavingsQueryParamsType };