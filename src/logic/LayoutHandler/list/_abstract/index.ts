import { ObjectType } from "@/types";
import { ValueHandler } from "@/logic/ValueHandler";

interface ListLayoutHandlerType {
    title?: string
    labels?: string[] 
    dataBox: ObjectType
    valueHandlers: ValueHandler[]
}

class ListLayoutHandler {

    title: string;
    labels: string[];
    dataBox: ObjectType = {};
    valueHandlers: ValueHandler[] = [];

    constructor( { title, labels, dataBox, valueHandlers }: ListLayoutHandlerType ) {

        this.title = title || '(title)';
        this.labels = labels || valueHandlers.map( h => h.label );
        this.dataBox = dataBox;
        this.valueHandlers = valueHandlers;
    }

    toJSON(): ObjectType {
        return {
            title: this.title,
            labels: this.labels,
            dataBox: this.dataBox,
            valueHandlers: this.valueHandlers.map( h => h.toJSON() ),
        }
    }
}

class StandardListLayoutHandler extends ListLayoutHandler {}

export { ListLayoutHandler, StandardListLayoutHandler };
