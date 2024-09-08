interface RequestErrorType {
    statusCode?: number;
    statusText?: string;
    message?: string;
}

type LegendType = {
    [ key: string ]: { [ key: string ]: any }[]
}

interface RequestResultType {
    headers: string[];
    data: any[];
    legend: LegendType | null;
}[]

export type { 
    RequestErrorType,
    RequestResultType,
};