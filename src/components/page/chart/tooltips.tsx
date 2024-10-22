import { Unit } from "@/components/Unit";

import { withCommas, withPlusSign } from '@/helpers/numbers';
import { timeLabel } from '@/helpers/time';
import { ChartHandler } from "@/logic/ChartHandler";
import { MinimalChartLayoutHandler } from "@/logic/LayoutHandler/chart";

import { NestedValueSpecifier, ValueSpecifier } from '@/logic/ValueSpecifier';
import ValueSpecifierCollection from '@/logic/ValueSpecifier/ValueSpecifierCollection';

import type { ObjectType } from '@/types';

type CardTooltipPropsType = {
    active?: boolean
    payload?: any
    layoutHandler: MinimalChartLayoutHandler
} 

const CardTooltip = ( { active, payload, layoutHandler }: CardTooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        // const { date, value } = payload[ 0 ].payload;
        const dateKey = layoutHandler.xValueHandler.key;
        const date = payload[ 0 ].payload[ dateKey ];
        const values: ObjectType[] = layoutHandler.yValueHandlers.map( handler => ( {
            label: handler.label,
            value: payload[ 0 ].payload[ handler.key ],
            unit: handler.unit,
        } ) ).sort( ( a, b ) => b.value - a.value );

        return (
            <div className="Tooltip">
                <p>{ `Date: ${date}` }</p>
                { values.map( ( v, i ) => 
                    <p key={ i }>{ `${v.label}: ${withCommas( v.value )}` } <Unit unit={ v.unit }/></p>
                ) }
            </div>
      );
    }
  
    return null;
};

type TooltipPropsType = {
    active?: boolean
    payload?: any
    specifierCollection: ValueSpecifierCollection
} 

const SingleTooltip = ( { active, payload, specifierCollection }: TooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        payload = payload[ 0 ].payload;

        const timeSpecifier: ValueSpecifier = specifierCollection.getByAxeX()[ 0 ];
        const valueSpecifier: ValueSpecifier = specifierCollection.getByAxeY()[ 0 ];
        const diffSpecifier: ValueSpecifier = specifierCollection.getByKey( `${valueSpecifier.key}_difference` );
        const pcSpecifier: ValueSpecifier = specifierCollection.getByKey( `${valueSpecifier.key}_percentage` );

        const time: string = payload[ timeSpecifier.key ];
        const value: number = payload[ valueSpecifier.key ];
        const difference: number = payload[ diffSpecifier.key ];
        const percentage: number = payload[ pcSpecifier.key ];

        return (
            <div className="Tooltip">
                <p>{ `${timeLabel( time )}: ${time}` }</p>
                <p>{ `${valueSpecifier[ 'label' ]}: ${withCommas( value )} ` } 
                    <Unit unit={ valueSpecifier.unit }/>
                </p>
                <p>{ `Change: ${withCommas( Math.round( difference ) )} ` }
                    <Unit unit={ valueSpecifier.unit }/>
                    { ` (${withPlusSign( percentage )}%)` }
                </p>
            </div>
      );
    }
  
    return null;
};

type TimelessTooltipPropsType = {
    active?: boolean
    payload?: any
    specifierCollection: ValueSpecifierCollection
} 

const TimelessTooltip = ( { active, payload, specifierCollection }: TimelessTooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        payload = payload[ 0 ].payload;

        const municipalitySpecifier: ValueSpecifier = specifierCollection.getByAxeX()[ 0 ];
        const nameSpecifier: ValueSpecifier = specifierCollection.getByKey( 'name' );
        const areaSpecifier: ValueSpecifier = specifierCollection.getByKey( 'area' );
        const populationSpecifier: ValueSpecifier = specifierCollection.getByKey( 'population' );
        const eventsSpecifier: ValueSpecifier = specifierCollection.getByKey( 'events' );
        const overAreaSpecifier: ValueSpecifier = specifierCollection.getByKey( 'events_over_area' );
        const overPopulationSpecifier: ValueSpecifier = specifierCollection.getByKey( 'events_over_population' );

        // const valueSpecifier: ValueSpecifier = specifierCollection.getByAxeY()[ 0 ];
        // const item: string = payload[ itemSpecifier.key ];
        // const value: number = payload[ valueSpecifier.key ];
        const name: string = payload[ nameSpecifier.key ];
        const area: number = payload[ areaSpecifier.key ];
        const population: number = payload[ populationSpecifier.key ];
        const events: number = payload[ eventsSpecifier.key ];
        const overArea: number = payload[ overAreaSpecifier.key ];
        const overPopulation: number = payload[ overPopulationSpecifier.key ];

        return (
            <div className="Tooltip">
                <strong>
                    <div>{ municipalitySpecifier[ 'label'] } of { name }</div>
                </strong>
                <table>
                    <tbody>
                        <tr>
                            <td>{ areaSpecifier[ 'label'] }</td>
                            <td>{ withCommas( area ) }</td>
                        </tr>
                        <tr>
                            <td>{ populationSpecifier[ 'label'] }</td>
                            <td>{ withCommas( population ) }</td>
                        </tr>
                        <tr>
                            <td>{ eventsSpecifier[ 'label'] }</td>
                            <td>{ withCommas( events ) }</td>
                        </tr>
                        <tr>
                            <td>{ overAreaSpecifier[ 'label'] }</td>
                            <td>{ withCommas( Math.round( overArea * 10 ) / 10 ) }</td>
                        </tr>
                        <tr>
                            <td>{ overPopulationSpecifier[ 'label'] }</td>
                            <td>{ withCommas( Math.round( overPopulation * 10 ) / 10 ) }</td>
                        </tr>
                    </tbody>
                </table>
            </div>
      );
    }
  
    return null;
};

const MultiTooltip = ( { active, payload, specifierCollection }: TooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        payload = payload[ 0 ].payload;

        const timeSpecifier: ValueSpecifier = specifierCollection.getByAxeX()[ 0 ];
        const ySpecifiers: ValueSpecifier[] = specifierCollection.getByAxeY();

        const time = payload[ timeSpecifier.key ];
        const values = ySpecifiers.map( s => payload[ s.key ] );

        return (
            <div className="Tooltip">
                <table>
                    <tbody>
                        <tr>
                            <td>{ timeLabel( time ) }</td>
                            <td>{ time }</td>
                        </tr>
                        { ySpecifiers.map( ( s, i ) => {
                            return ( 
                                <tr key={i}>
                                    <td>{ s.label }</td>
                                    <td>{ values[ i ] } <Unit unit={ s.unit } /></td>
                                </tr> 
                            );
                        } ) }
                    </tbody>
                </table>
            </div>
      );
    }
  
    return null;
};

type StackTooltipPropsType = {
    active?: boolean
    payload?: any
    chartHandler: ChartHandler
    makeItemsRepr: CallableFunction
} 

const StackTooltip = ( { active, payload, chartHandler, makeItemsRepr }: StackTooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        payload = payload[ 0 ].payload;

        const specifierCollection: ValueSpecifierCollection = chartHandler.specifierCollection;
        const timeSpecifier: ValueSpecifier = specifierCollection.getByAxeX()[ 0 ];
        const sumSpecifier: ValueSpecifier = specifierCollection.getByKey( 'sum' );
        const nSpecifier: NestedValueSpecifier = specifierCollection.getNestedByAxeY()[ 0 ];

        const time = payload[ timeSpecifier.key ];
        const total = payload[ sumSpecifier.key ];

        const key = Object.keys( chartHandler.legend )[ 0 ];
        const legend: [] = chartHandler.legend[ key ];

        const legendRepr: ObjectType[] = makeItemsRepr( legend, payload, nSpecifier );

        return (
            <div className="Tooltip">
                <p>{ `${timeLabel( time )}: ${time}` }</p>

                <table>
                    <tbody>
                        <tr className='total'>
                            <td>Total</td> 
                            <td className='value'>{ withCommas( Math.round( total ) ) } <Unit unit={ sumSpecifier.unit }/></td>
                        </tr>
                        { legendRepr.map( ( item, i ) =>
                            <tr key={ i }>
                                <td>{ item.name }</td>
                                <td className='value'>{ withCommas( Math.round( item.value) ) } <Unit unit={ sumSpecifier.unit }/></td> 
                                <td className='value'>{ `${item.percentage}%` }</td>
                            </tr>
                        ) }
                    </tbody>
                </table>

            </div>
      );
    }
  
    return null;
};

export { CardTooltip, SingleTooltip, TimelessTooltip, MultiTooltip, StackTooltip };