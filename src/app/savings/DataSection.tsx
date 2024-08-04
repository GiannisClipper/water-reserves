import { Suspense } from "react";
import ChartSection from "./ChartSection";
import ListSection from "./ListSection";

type propsType = {
    searchParams: { time_range?: string }
}

const DataSection = async ( { searchParams }: propsType ) => {

    let result;

    if ( searchParams ) {
        const url: string = "http://localhost:8000/api/v1/savings?reservoir_aggregation=sum&" +
        `time_range=${searchParams.time_range}`
        // Object.keys( searchParams )
        //     .map( ( key: string ) => `${key}=${searchParams[key]}` )
        //     .join( '&' );

        console.log( url );
        const response = await fetch( url );
        result = await response.json();
    }

    console.log( "rendering: DataSection..." )

    return (
        <div className="DataSection">
            <span>Data section...</span>
            <Suspense fallback="<p>Loading...</p>">
                <ChartSection />
            </Suspense>
            <Suspense fallback="<p>Loading...</p>">
                <ListSection result={result} />
            </Suspense>
        </div>
    );
}

export default DataSection;