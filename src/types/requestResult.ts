interface RequestErrorType {
    statusCode?: number;
    statusText?: string;
    message?: string;
}

interface RequestErrorDetailType {
}

interface RequestResultType {
    headers: string[];
    data: any[];
}[]

export type { 
    RequestErrorType,
    RequestResultType,
};