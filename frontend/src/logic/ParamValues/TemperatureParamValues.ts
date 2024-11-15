import WeatherParamValues from "@/logic/ParamValues/WeatherParamValues";

import type { 
    SearchParamsType, 
    WeatherSearchParamsType,
} from "@/types/searchParams";

import { ObjectType } from "@/types";

class TemperatureParamValues extends WeatherParamValues {

    _locationAggregation: string | undefined;

    constructor( weatherSearchParams: WeatherSearchParamsType, locations: { [ key: string ]: any }[] ) {
        const searchParams: SearchParamsType = weatherSearchParams;
        searchParams.location_filter = '1';
        searchParams.location_aggregation = '';
        super( searchParams, locations );
    }
}

export default TemperatureParamValues;