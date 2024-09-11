import { CubicMeters } from "@/components/Symbols";
import { withCommas, withPlusSign } from "@/helpers/numbers";

import type { ObjectType } from "@/types";

type PropsType = { 
    headers: string[]
    data: ObjectType[]
}

const ListContent = ( { headers, data }: PropsType ) => {

    console.log( `rendering: ListContent...` )

    return (
        <table className="ListContent">
            <tbody>
                <tr>
                { headers.map( ( header: string, i: number ) =>
                    <th key={i}>{ header }</th>
                ) }
                </tr>

                { data.map( ( row: ObjectType, i: number ) =>
                    <tr key={ i }>
                        <td> { row.time } </td>
                        <td className='number'> { withCommas( row.quantity ) } <CubicMeters /></td>
                        <td className='number'> { withCommas( row.diff ) } <CubicMeters /></td>
                        <td className='number'> { withPlusSign( row.percent.toFixed( 2 ) ) } </td>
                    </tr>
                ) }
                </tbody>
        </table>
    );
}

export default ListContent;