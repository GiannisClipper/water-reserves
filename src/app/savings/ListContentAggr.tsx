import { CubicMeters } from "@/components/Symbols";
import { withCommas, withPlusSign } from "@/helpers/numbers";
import { SingleDataParser } from '@/logic/_common/DataParser';
import { translate } from "@/logic/_common/lexicon";

import type { ObjectType } from "@/types";
import type { RequestResultType } from "@/types/requestResult";

type PropsType = { result: RequestResultType | null }

const ListContent = ( { result }: PropsType ) => {

    const dataParser = new SingleDataParser( result );
    const headers: string[] = dataParser.headers;
    const data: ObjectType[] = dataParser.data;

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
                        <td className='number'> { withCommas( row.value ) } <CubicMeters /></td>
                        <td className='number'> { withCommas( row.difference ) } <CubicMeters /></td>
                        <td className='number'> { withPlusSign( row.percentage.toFixed( 2 ) ) } </td>
                    </tr>
                ) }
                </tbody>
        </table>
    );
}

export default ListContent;