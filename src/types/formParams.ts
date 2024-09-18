import type { ViewType, ChartType } from "./searchParams";

interface FormParamsType {

    viewType: ViewType
    chartType: ChartType

    fromDate: string
    toDate: string

    fromInterval: string
    toInterval: string

    timeAggregation: string
    valueAggregation: string
}

interface SavingsFormParamsType extends FormParamsType {
    reservoirFilter: { [ key: string ]: boolean }
    reservoirAggregation: string | undefined
}

export type { 
    ViewType, 
    ChartType,
    FormParamsType,
    SavingsFormParamsType,
};