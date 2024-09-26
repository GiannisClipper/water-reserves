import { ObjectType } from ".";

interface RequestErrorType {
    statusCode?: number;
    statusText?: string;
    message?: string;
}

type LegendType = {
    [ key: string ]: { [ key: string ]: any }[]
}

type RequestResult1Type = ObjectType[]

type RequestResult2Type {
    headers: string[];
    data: any[];
    legend: LegendType | null;
}[]

type RequestResultType = RequestResult1Type | RequestResult2Type

export type { 
    RequestErrorType,
    RequestResultType,
};