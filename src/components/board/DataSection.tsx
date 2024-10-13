import { DataSectionSkeleton } from "./Skeleton";
import Error from "@/components/page/Error";
import { Card } from "./Card";

import { ApiRequestFactory } from "@/logic/ApiRequest";

type PropsType = {
    endpoint: string
}

const DataSection = async ( { endpoint }: PropsType ) => {

    const apiRequestCollection = new ApiRequestFactory( endpoint ).apiRequestCollection;
    let { error, result } = ( await apiRequestCollection.request() ).toJSON() ;

    if ( result ) {
        const key = Object.keys( result )[ 0 ];
        result = result[ key ];
    }

    console.log( "rendering: DataSection...", error, result )

    return (
        ! error && ! result
        ?
        <div className="DataSection">
            <DataSectionSkeleton /> 
        </div>

        : error
        ? 
        <DataSectionSkeleton>
            <Error error={error} /> 
        </DataSectionSkeleton>

        :
        <div className="DataSection">
            <Card
                option='savings'
                result={ result }
            />
            <Card
                option='production'
                result={ result }
            />
            <Card
                option='precipitation'
                result={ result }
            />
            <Card
                option='temperature'
                result={ result }
            />
        </div>
    );
}

export default DataSection;

