import { Fragment } from "react";
import { CubicMeters } from "@/components/Symbols";
import { withCommas } from "@/helpers/numbers";
import ObjectList from "@/helpers/objects/ObjectList";

import { StackDataParser } from '@/logic/_common/DataParser';
import { lexicon } from "@/logic/_common/lexicon";

import type { ObjectType } from "@/types";

type PropsType = { 
    dataParser: StackDataParser
}

const ListContent = ( { dataParser }: PropsType ) => {

    const headers: string[] = dataParser.headers;
    const data: ObjectType[] = dataParser.data;
    const items = new ObjectList( dataParser.items ).sortBy( 'start', 'desc' );
    // sortBy start: most recent at the beggining

    // update lexicon
    items.forEach( r => lexicon[ r.name_en ] = r.name_el );

    console.log( `rendering: ListContent...`, headers, data )

    return (
        <table className="ListContent">
            <tbody>
                <tr>
                { headers.map( ( header: string, i: number ) =>
                    <th 
                        key={ i }
                        data-key={ header }
                    >
                        { lexicon[ header ] }
                    </th>
                ) }
                </tr>

                { data.map( ( row: ObjectType, i: number ) =>
                    <tr key={ i }>

                        <td> { row.time } </td>
                        <td className='number'> { withCommas( row.total ) } <CubicMeters /></td>

                        { items.map( ( r: ObjectType ) =>
                            <Fragment key={ r.id }>
                                <td className='number'>{ withCommas( row.values[ r.id ].value ) }</td>
                                <td className='number'>{ row.values[ r.id ].percentage }%</td>
                            </Fragment>
                        ) }
                    </tr>
                ) }
                </tbody>
        </table>
    );
}

export default ListContent;