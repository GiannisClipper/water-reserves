import { useEffect } from "react";

import BrowserUrl from "@/helpers/url/BrowserUrl";
import { ParamHandler } from "./ParamHandler";

import type { ObjectType } from "@/types";
import type { ChartType } from "@/types/searchParams";

type PropsType = {
    onSearch: boolean
    params: ObjectType
    paramHandler: ParamHandler
}

const useSearchData = ( { onSearch, params, paramHandler }: PropsType ) => {

    return useEffect( () => {

        if ( onSearch ) {

            const url: BrowserUrl = new BrowserUrl( window );

            // update chartType from url
            const chartType: string | undefined = url.getParam( 'chart_type' );
            if ( chartType ) {
                params.chartType = chartType as ChartType;
            }

            // convert form params to query string
            const queryString: string = paramHandler.paramValues
                .fromJSON( params )
                .toQueryString();

            // update browser url and request page
            url.setParams( queryString.split( '&' ) );
            url.open();
        }

    }, [ onSearch ] );
}

export default useSearchData;
