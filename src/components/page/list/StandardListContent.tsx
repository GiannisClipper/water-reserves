import { CubicMeters } from "@/components/Symbols";
import { Unit } from "@/components/Unit";
import { withCommas, withPlusSign } from "@/helpers/numbers";
import DataParser from '@/logic/DataParser';
import { ListLayoutHandler, StandardListLayoutHandler } from '@/logic/LayoutHandler/list/_abstract';
import { ValueHandler } from "@/logic/ValueHandler";

import type { ObjectType } from "@/types";

import "@/styles/list.css";

type PropsType = { 
    dataParser: DataParser
    layoutHandler: StandardListLayoutHandler
}

const ListContent = ( { dataParser, layoutHandler }: PropsType ) => {

    const valueHandlers = layoutHandler.valueHandlers;
    const data: ObjectType[] = dataParser.data;

    console.log( `rendering: ListContent...` )

    return (
        <table className="ListContent">

            <caption>{ layoutHandler.title }</caption>

            <thead>
            </thead>
            <tbody>
            <tr>
                { valueHandlers.map( ( handler: ValueHandler, i: number ) =>
                    <th 
                        key={ i }
                        data-key={ handler.label }
                    >
                        { handler.label }
                    </th>
                ) }
                </tr>

                { data.map( ( row: ObjectType, i: number ) =>
                    <tr key={ i }>
                    { valueHandlers.map( ( handler: ValueHandler, j: number ) =>
                        <td
                            key={ j }
                            data-key={ handler.key }
                            className={ handler.type }
                        >
                            { 
                            handler.type === 'number' 
                            ? withCommas( row[ handler.key ] )
                            : row[ handler.key ] 
                            }
                            <span> </span>
                            <Unit unit={ handler.unit } />
                        </td>
                    ) }
                    </tr>
                ) }
            </tbody>
        </table>
    );
}

export default ListContent;