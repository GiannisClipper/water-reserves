type ViewType = 'overall' | 'chart' | 'list';

type ChartType = 'line' | 'area' | 'bar';

interface SearchParamsType {

    view_type?: ViewType
    chart_type?: ChartType

    time_range?: string
    interval_filter?: string

    time_aggregation?: string
    year_start?: string

    value_aggregation?: string
}

interface SavingsSearchParamsType extends SearchParamsType {
    reservoir_aggregation?: string
    reservoir_filter?: string
}

interface SavingsReservoirSearchParamsType extends SearchParamsType {
    reservoir_filter?: string
}

export type { 
    ViewType, 
    ChartType, 
    SearchParamsType,
    SavingsSearchParamsType,
    SavingsReservoirSearchParamsType,
};