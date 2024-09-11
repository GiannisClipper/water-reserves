import { Fragment } from "react";
import { CubicMeters } from "@/components/Symbols";
import { withCommas } from "@/helpers/numbers";
import ObjectList from "@/helpers/objects/ObjectList";

import { getReservoirs, getNonAggregatedData } from '@/logic/savings-reservoir/_common';
import { getHeaders } from '@/logic/savings-reservoir/list';
import { lexicon, translate } from "@/logic/lexicon";

import type { ObjectType } from "@/types";
import type { RequestResultType } from "@/types/requestResult";

type PropsType = { result: RequestResultType | null }

const ListContent = ( { result }: PropsType ) => {

    const data: ObjectType[] = getNonAggregatedData( result );
    let reservoirs: ObjectType[] = getReservoirs( result, data );
    // sortBy start: most recent at the beggining
    reservoirs = new ObjectList( reservoirs ).sortBy( 'start', 'desc' );
    reservoirs.forEach( r => lexicon[ r.name_en ] = r.name_el );

    const headers: string[] = getHeaders( data, reservoirs );

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

                        { reservoirs.map( ( r: ObjectType ) =>
                            <Fragment key={ r.id }>
                                <td className='number'>{ withCommas( row.quantities[ r.id ].quantity ) }</td>
                                <td className='number'>{ row.quantities[ r.id ].percent }%</td>
                            </Fragment>
                        ) }
                    </tr>
                 ) }
                </tbody>
        </table>
    );
}

export default ListContent;