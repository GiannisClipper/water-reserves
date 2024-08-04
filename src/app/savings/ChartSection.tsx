import ChartLabel from "./ChartLabel";
import ChartContent from "./ChartContent";

const ChartSection = async () => {

    await new Promise( resolve => setTimeout( resolve, 3000 ) )
    const result: number = Math.floor( Math.random() * 10 );

    console.log( "rendering: ChartSection..." )

    return (
        <div className="ChartSection">
            <span>Chart section... {result}</span>
            <ChartLabel />
            <ChartContent />
        </div>
    );
}

export default ChartSection;