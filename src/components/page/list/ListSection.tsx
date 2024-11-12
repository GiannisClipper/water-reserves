import ListLabel from "@/components/page/list/ListLabel";
import StandardListContent from "@/components/page/list/StandardListContent";

import ListLayoutHandlerFactory from "@/logic/LayoutHandler/list/ListLayoutHandlerFactory";

import type { SearchParamsType } from "@/types/searchParams";
import type { ObjectType } from "@/types";
import { ProductionLegend, SavingsLegend, WeatherLegend } from "./legends";

type PropsType = {
    endpoint: string
    searchParams: SearchParamsType
    dataBox: ObjectType
}

const ListSection = ( { endpoint, searchParams, dataBox }: PropsType  ) => {

    // await new Promise( resolve => setTimeout( resolve, 1000 ) )
    // const result: number = Math.floor( Math.random() * 10 );

    const layoutHandler = new ListLayoutHandlerFactory( endpoint, searchParams, dataBox )
        .handler;

    const listLegends: ObjectType = {
        'savings': SavingsLegend,
        'production': ProductionLegend,
        'precipitation': WeatherLegend,
    };

    const Legend = listLegends[ endpoint ];

    console.log( "rendering: ListSection..." )

    return (
        <div className="ListSection">
            <ListLabel />

            <StandardListContent
                dataBox={ dataBox }
                layoutHandler={ layoutHandler }
                Legend={ Legend }
            />
        </div>
    );
}

export default ListSection;