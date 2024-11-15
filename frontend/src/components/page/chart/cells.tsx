import { Cell } from "recharts";
import type { ObjectType } from "@/types";
import { ValueHandler } from "@/logic/ValueHandler";

type CellPropsType = {
    key: number,
    payload: ObjectType,
    handler?: ValueHandler,
}

const getCell = ( { key }: CellPropsType ) => {
    return (
        <Cell key={ key } />
    );
}

const getClusterColorCell = ( { key, payload, handler }: CellPropsType ) => {

    const color: string = handler?.color[ 200 + 100 * payload.cluster ];

    return (
        <Cell key={ key } fill={color} />
    );
}

export { getCell, getClusterColorCell };