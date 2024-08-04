type propsType = {
    result: {
        headers: string[]
        data: {}[]
    }[]
}

const ListContent = ( { result }: any ) => {

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