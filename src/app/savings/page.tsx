import ParamSection from "./ParamSection";
import DataSection from "./DataSection";
import { Suspense } from "react";

export default function Savings() {

    console.log( "rendering: Savings (page)..." )

    return (
        <>
        <div className="page-title">
            Savings page
        </div>
        <div className="page-sections">
            <ParamSection />
            <Suspense fallback="<p>Loading...</p>">
                <DataSection />
            </Suspense>
        </div>
        </>
);
}

