type ChartType = 'line' | 'area' | 'bar';

type ViewType = 'overall' | 'chart' | 'list';

interface SearchParamsType {
    // [key: string]: string

    from_date?: string
    to_date?: string
    from_month_day?: string
    to_month_day?: string
    time_aggregation?: string

    chart_type?: ChartType
    view_type?: ViewType
}

export type { SearchParamsType };