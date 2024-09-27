import { CubicMeters } from "@/components/Symbols";
import { withCommas, withPlusSign } from "@/helpers/numbers";
import { SingleDataHandler } from '@/logic/DataHandler';
import { translate } from "@/logic/lexicon";

import type { ObjectType } from "@/types";

type PropsType = { 
    dataHandler: SingleDataHandler
}

const ListContent = ( { dataHandler }: PropsType ) => {

    const headers: string[] = dataHandler.headers;
    const data: ObjectType[] = dataHandler.data;

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