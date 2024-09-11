import { CubicMeters } from "@/components/Symbols";
import { withCommas, withPlusSign } from "@/helpers/numbers";
import { getHeaders } from '@/logic/savings/list';
import { getAggregatedData } from '@/logic/savings/_common';
import { translate } from "@/logic/lexicon";

import type { ObjectType } from "@/types";
import type { RequestResultType } from "@/types/requestResult";

type PropsType = { result: RequestResultType | null }

const ListContent = ( { result }: PropsType ) => {

    const data: ObjectType[] = getAggregatedData( result );
    const headers: string[] = getHeaders( data );

    console.log( `rendering: ListContent...` )

    return (
        <table className="ListContent">
            <tbody>
                <tr>
                { headers.map( ( header: string, i: number ) =>
                    <th 
                        key={ i }
                        data-key={ header }
                    >
                        { translate( header ) }
                    </th>
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