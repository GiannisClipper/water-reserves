import { RequestMakerFactory } from "@/logic/RequestMaker/RequestMakerFactory";
import DataParserFactory from "@/logic/DataParser/DataParserFactory";

import type { SearchParamsType } from "@/types/searchParams";

type PropsType = {
    endpoint: string
    searchParams: SearchParamsType 
}

// it's not a hook, but a function running server-side, 
// the use... name selected for semantic similarity with usePageRequest
const useApiRequest = async ( { endpoint, searchParams }: PropsType ) => {

    if ( Object.keys( searchParams ).length ) {

        const requestMakerCollection = new RequestMakerFactory( endpoint, searchParams ).requestMakerCollection;
        const { error, result } = ( await requestMakerCollection.request() ).toJSON();
    
        if ( error ) {
            return [ error, null ]; 
        }

        const dataParser = new DataParserFactory( { endpoint, searchParams, result } ).dataParser;
        return [ null, dataParser.toJSON() ];
    }

    return [ null, null ]; 
}

export default useApiRequest;
