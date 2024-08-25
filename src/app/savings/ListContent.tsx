import type { RequestResultType } from "@/types/requestResult";

type PropsType = { result: RequestResultType | null }

const ListContent = ( { result }: PropsType ) => {

    const headers: string[] = result && result.headers || [];
    const data: [][] = result && result.data || [];

    console.log( `rendering: ListContent...` )

    return (
        <table className="ListContent">
            <tbody>
                <tr key={0}>
                { headers.map( ( val: string | number, i: number ) =>
                    <th key={i}>{val}</th>
                ) }
                </tr>

                { data.map( ( row: (string | number)[], j: number ) =>
                    <tr key={j+1}>
                        { row.map( ( val: string | number, i: number ) =>
                            <td key={i}>{val}</td>
                        ) }
                    </tr>
                ) }
                </tbody>
        </table>
    );
}

export default ListContent;