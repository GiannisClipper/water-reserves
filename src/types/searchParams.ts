type ViewType = 'overall' | 'chart' | 'list';

type ChartType = 'line' | 'area' | 'bar';

interface SearchParamsType {

    view_type?: ViewType
    chart_type?: ChartType

    time_range?: string
    interval_filter?: string

    time_aggregation?: string
    year_start?: string
}

interface SavingsSearchParamsType extends SearchParamsType {
    reservoir_filter?: string
    reservoir_aggregation?: string
}

export type { 
    ViewType, 
    ChartType, 
    SearchParamsType,
    SavingsSearchParamsType,
};