import { ObjectType } from "@/types";
import { ValueHandler } from "@/logic/ValueHandler";

interface ListLayoutHandlerType {
    title?: string
    data: ObjectType[]
    valueHandlers: ValueHandler[]
}

class ListLayoutHandler {

    title: string;
    data: ObjectType[] = [];
    valueHandlers: ValueHandler[] = [];

    constructor( { title, data, valueHandlers }: ListLayoutHandlerType ) {

        this.title = title || '(title)';
        this.data = data;
        this.valueHandlers = valueHandlers;
    }


    toJSON(): ObjectType {
        return {
            title: this.title,
            data: this.data,
            valueHandlers: this.valueHandlers.map( h => h.toJSON() ),
        }
    }
}

class StandardListLayoutHandler extends ListLayoutHandler {}

export { ListLayoutHandler, StandardListLayoutHandler };
