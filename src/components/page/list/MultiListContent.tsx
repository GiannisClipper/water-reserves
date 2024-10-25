import DataParser from '@/logic/DataParser';
import { translate } from "@/logic/lexicon";

import type { ObjectType } from "@/types";
import { Fragment } from "react";

type PropsType = { 
    dataParser: DataParser
}

const ListContent = ( { dataParser }: PropsType ) => {

    const headers: string[] = dataParser.headers;
    const data: ObjectType[] = dataParser.data;

    console.log( `rendering: ListContent...` )//, JSON.stringify(headers), JSON.stringify(data) )

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
                        { headers.map( ( x: string, j: number ) => {
                            const valueKey = j === 0 ? 'time' : x;
                            return (
                                <Fragment key={ x }>
                                    <td className='number'>{ 
                                        j === 0
                                        ? row[ valueKey ]
                                        : Math.round( row[ valueKey ] * 100 ) / 100 
                                    }</td>
                                </Fragment>
                            );
                        } ) }
                    </tr>
                ) }
                </tbody>
        </table>
    );
}

export default ListContent;