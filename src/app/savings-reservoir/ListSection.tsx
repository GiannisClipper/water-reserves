import ListLabel from "../savings/ListLabel";
import ListContent from "../savings/ListContent";
import type { RequestResultType } from "@/types/requestResult";

type PropsType = { result: RequestResultType | null }

const ListSection = async ( { result }: PropsType ) => {

    // await new Promise( resolve => setTimeout( resolve, 1000 ) )
    // const result: number = Math.floor( Math.random() * 10 );

    console.log( "rendering: ListSection..." )

    return (
        <div className="ListSection">
            <ListLabel result={result} />
            <ListContent result={result} />
        </div>
    );
}

export default ListSection;