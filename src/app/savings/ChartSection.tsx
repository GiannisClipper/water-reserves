import ChartLabel from "./ChartLabel";
import ChartContent from "./ChartContent";
import type { RequestResultType } from "@/types/requestResult";

type PropsType = { result: RequestResultType | null }

const ChartSection = async ( { result }: PropsType  ) => {

    // await new Promise( resolve => setTimeout( resolve, 3000 ) )
    // const result: number = Math.floor( Math.random() * 10 );

    console.log( "rendering: ChartSection..." )

    return (
        <div className="ChartSection">
            <ChartLabel />
            <ChartContent result={result} />
        </div>
    );
}

export default ChartSection;