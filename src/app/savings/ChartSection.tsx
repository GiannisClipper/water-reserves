import ChartLabel from "./ChartLabel";
import ChartContent from "./ChartContent";

interface resultType {
    headers: string[];
    data: any[];
}[]

type propsType = {
    result: resultType
}

const ChartSection = async ( { result }: propsType  ) => {

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