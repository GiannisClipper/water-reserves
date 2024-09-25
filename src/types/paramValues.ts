import type { ViewType, ChartType } from "@/types/searchParams";

interface ParamValuesType {

    viewType: ViewType
    chartType: ChartType

    fromDate: string
    toDate: string

    fromInterval: string
    toInterval: string

    timeAggregation: string
    valueAggregation: string
}

interface SavingsParamValuesType extends ParamValuesType {
    reservoirFilter: { [ key: string ]: boolean }
    reservoirAggregation: string | undefined
}

export type { 
    ViewType, 
    ChartType,
    ParamValuesType,
    SavingsParamValuesType,
};