import ListLabel from "./ListLabel";
import ListContent from "./ListContent";

type propsType = {
    result: Object[]
}

const ListSection = async ( { result }: propsType ) => {

    // await new Promise( resolve => setTimeout( resolve, 2000 ) )
    // const result: number = Math.floor( Math.random() * 10 );

    console.log( "rendering: ListSection..." )

    return (
        <div className="ListSection">
            <ListLabel />
            <ListContent result={result} />
        </div>
    );
}

export default ListSection;