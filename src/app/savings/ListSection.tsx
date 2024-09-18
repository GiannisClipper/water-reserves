import ListLabel from "@/components/Page/List/ListLabel";
import ListContentAggr from "./ListContentAggr";
import ListContentNonAggr from "./ListContentNonAggr";
import type { SavingsSearchParamsType } from "@/types/searchParams";
import type { RequestResultType } from "@/types/requestResult";

type PropsType = { 
    searchParams: SavingsSearchParamsType
    result: RequestResultType | null 
}

const ListSection = async ( { searchParams, result }: PropsType ) => {

    // await new Promise( resolve => setTimeout( resolve, 1000 ) )
    // const result: number = Math.floor( Math.random() * 10 );

    const reservoirAggregation: string | undefined = searchParams.reservoir_aggregation;

    console.log( "rendering: ListSection..." )

    return (
        <div className="ListSection">
            <ListLabel 
                result={ result } 
            />

            { reservoirAggregation 
            ? 
                <ListContentAggr
                    result={ result } 
                />
            : 
                <ListContentNonAggr
                    result={ result } 
                />
            }
        </div>
    );
}

export default ListSection;