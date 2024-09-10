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
    reservoirAggregation: string
}

interface SavingsReservoirFormParamsType extends FormParamsType {
    reservoirFilter: { [ key: string ]: boolean }
}

export type { 
    ViewType, 
    ChartType,
    FormParamsType,
    SavingsFormParamsType,
    SavingsReservoirFormParamsType,
};