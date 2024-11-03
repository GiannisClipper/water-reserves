import { ObjectType } from "@/types";
import { ValueHandler } from "@/logic/ValueHandler";

interface ListLayoutHandlerType {
    title?: string
    labels?: string[] 
    data: ObjectType[]
    valueHandlers: ValueHandler[]
}

class ListLayoutHandler {

    title: string;
    labels: string[];
    data: ObjectType[] = [];
    valueHandlers: ValueHandler[] = [];

    constructor( { title, labels, data, valueHandlers }: ListLayoutHandlerType ) {

        this.title = title || '(title)';
        this.labels = labels || valueHandlers.map( h => h.label );
        this.data = data;
        this.valueHandlers = valueHandlers;
    }


    toJSON(): ObjectType {
        return {
            title: this.title,
            labels: this.labels,
            data: this.data,
            valueHandlers: this.valueHandlers.map( h => h.toJSON() ),
        }
    }
}

class StandardListLayoutHandler extends ListLayoutHandler {}

export { ListLayoutHandler, StandardListLayoutHandler };
