import { Suspense } from "react";
import ChartSection from "./ChartSection";
import ListSection from "./ListSection";

const DataSection = async () => {

    // await new Promise( resolve => setTimeout( resolve, 2000 ) )
    // const result: number = Math.floor( Math.random() * 10 );
    const response = await fetch( "http://localhost:8000/api/v1/savings?time_range=2022-07&reservoir_aggregation=sum" );
    const result = await response.json();

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