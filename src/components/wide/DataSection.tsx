import { ChartSectionSkeleton } from "@/components/page/Skeleton";
import Error from "@/components/page/Error";
import ChartSection from "./chart/ChartSection";

import { ApiRequest, ApiRequestFactory } from "@/logic/ApiRequest";

import type { SearchParamsType } from "@/types/searchParams";

type PropsType = { 
    endpoint: string
    searchParams: SearchParamsType 
}

const DataSection = async ( { endpoint, searchParams }: PropsType ) => {

    // await new Promise( resolve => setTimeout( resolve, 2000 ) )

    let error = null, result = null;

    if ( Object.keys( searchParams ).length ) {

        if ( endpoint !== 'savings-production' ) {
            const apiRequest: ApiRequest = new ApiRequestFactory( endpoint, searchParams ).apiRequest;
            ( { error, result } = ( await apiRequest.request() ).toJSON() );

        } else {
            const extendedSearchParams = { ...searchParams, reservoir_aggregation: 'sum' };
            const apiRequest: ApiRequest = new ApiRequestFactory( 'savings', extendedSearchParams ).apiRequest;
            const { error: error1, result: result1 } = ( await apiRequest.request() ).toJSON();
            if ( error1 ) {
                error = error1;
                result = null;
            } else {
                let { time_aggregation } = searchParams;
                // time_aggregation = time_aggregation?.replace( ',avg', ',sum' );
                // console.log( 'time_aggregation', time_aggregation) 
                const extendedSearchParams = { ...searchParams, factory_aggregation: 'sum' };
                const apiRequest: ApiRequest = new ApiRequestFactory( 'production', extendedSearchParams ).apiRequest;
                const { error: error2, result: result2 } = ( await apiRequest.request() ).toJSON();
                if ( error2 ) {
                    error = error2;
                    result = null;
                }
                result = [ result1, result2 ];
            }
        }
    }

    console.log( "rendering: DataSection..." );

    return ( 
        
        ! error && ! result
        ?
        <div className="DataSection">
            <ChartSectionSkeleton /> 
        </div>

        : error
        ? 
        <div className="DataSection">
            <ChartSectionSkeleton>
                <Error error={error} /> 
            </ChartSectionSkeleton>
        </div>

        :
        <div className="DataSection">
            <ChartSection 
                endpoint={ endpoint }
                searchParams={ searchParams }
                result={ result }
            />
        </div>
    );
}

export default DataSection;