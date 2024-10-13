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
        super( searchParams, locations );
        this._locationAggregation = Object.keys( weatherSearchParams ).length
            ? weatherSearchParams.location_aggregation || ''
            : 'avg';
    }
}

export default TemperatureParamValues;