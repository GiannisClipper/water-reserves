import { CardHandlerFactory } from "@/logic/CardHandler";
import { withCommas } from "@/helpers/numbers";

import type { ObjectType } from "@/types";

type PropsType = { 
    option: string
    result: ObjectType
};

const Card = ( { option, result }: PropsType ) => {

    const cardHandler = new CardHandlerFactory( option, result ).cardHandler;

    function withCommans(value: number): import("react").ReactNode {
        throw new Error("Function not implemented.");
    }

    return (
        <div className="Card">
            <p>Interval: { cardHandler.interval }</p>
            <p>Date: { cardHandler.date }</p>
            <p>Value: { `${withCommas( cardHandler.value )} ${cardHandler.unit}` }</p>
        </div>
    );
}

export { Card };
