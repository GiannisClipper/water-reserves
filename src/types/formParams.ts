type ViewType = 'overall' | 'chart' | 'list';

type ChartType = 'line' | 'area' | 'bar';

interface FormParamsType {
    // [key: string]: string

    view_type: ViewType
    chart_type: ChartType

    from_date: string
    to_date: string

    from_month_day: string
    to_month_day: string

    value_aggregation: string
    time_aggregation: string
}

interface SavingsFormParamsType extends FormParamsType {
    reservoir_filter: { [ key: string ]: boolean }
}

export type { 
    ViewType, 
    ChartType,
    FormParamsType,
    SavingsFormParamsType,
};