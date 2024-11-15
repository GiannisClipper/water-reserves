import { ListLayoutHandler } from "@/logic/LayoutHandler/list/_abstract";

type LegendPropsType = {
    layoutHandler?: ListLayoutHandler
}

const SavingsLegend = ( { layoutHandler }: LegendPropsType ) => {

    return [ layoutHandler?.dataBox.legend.reservoirs.map( r => r.name_en ).join( ',' ) ];
}

const ProductionLegend = ( { layoutHandler }: LegendPropsType ) => {

    return [ layoutHandler?.dataBox.legend.factories.map( f => f.name_en ).join( ',' ) ];
}

const WeatherLegend = ( { layoutHandler }: LegendPropsType ) => {

    return [ layoutHandler?.dataBox.legend.locations.map( l => l.name_en ).join( ',' ) ];
}

export { 
    SavingsLegend,
    ProductionLegend,
    WeatherLegend,
};
