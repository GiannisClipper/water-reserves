import { Unit } from "@/components/Unit";
import { withCommas, withPlusSign } from "@/helpers/numbers";
import { StandardListLayoutHandler } from '@/logic/LayoutHandler/list/_abstract';
import { ValueHandler } from "@/logic/ValueHandler";

import type { ObjectType } from "@/types";

import "@/styles/list.css";

const getNested = ( obj: ObjectType, key: string ): any => {
    const keys = key.split( '.' );
    if ( keys.length > 1 ) {
        return getNested( obj[ keys[ 0 ] ], keys.slice( 1 ).join( '.' ) );
    }
    return obj[ key ];
}

type PropsType = { 
    dataBox: ObjectType
    layoutHandler: StandardListLayoutHandler
    Legend: any
}

const ListContent = ( { dataBox, layoutHandler, Legend }: PropsType ) => {

    const data: ObjectType[] = dataBox.data;
    const valueHandlers = layoutHandler.valueHandlers;

    console.log( `rendering: ListContent...` )

    return (
        <div className="ListContent">

            <table>
                <caption>
                    <div>{ layoutHandler.title }</div>
                    <div>{ Legend ? <Legend layoutHandler={ layoutHandler } /> : null }</div>
                </caption>

                <thead>
                    <tr>
                        { layoutHandler.labels.map( ( label: string, i: number ) =>
                            <th 
                                key={ i }
                                data-key={ label }
                            >
                                { label }
                            </th>
                        ) }
                    </tr>
                </thead>

                <tbody>

                    { data.map( ( row: ObjectType, i: number ) =>
                        <tr key={ i }>
                        { valueHandlers.map( ( handler: ValueHandler, j: number ) =>
                            <td
                                key={ j }
                                data-key={ getNested( row, handler.key ) }
                                className={ handler.type }
                            >
                                { handler.type === 'number' 
                                ? 
                                withCommas( getNested( row, handler.key ) )
                                : 
                                getNested( row, handler.key ) 
                                }
                                <span> </span> {/* to place a space between values */}
                                <Unit unit={ handler.unit } />
                            </td>
                        ) }
                        </tr>
                    ) }
                </tbody>
            </table>

        </div>
    );
}

export default ListContent;
