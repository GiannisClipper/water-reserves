import { Unit } from "@/components/Unit";

import { withCommas, withPlusSign } from '@/helpers/numbers';
import { timeLabel } from '@/helpers/time';
import { ChartHandler } from "@/logic/ChartHandler";

import { NestedValueSpecifier, ValueSpecifier } from '@/logic/ValueSpecifier';
import ValueSpecifierCollection from '@/logic/ValueSpecifier/ValueSpecifierCollection';

import type { ObjectType } from '@/types';

type CardTooltipPropsType = {
    active?: boolean
    payload?: any
    layoutSpecifier: ObjectType
} 

const CardTooltip = ( { active, payload, layoutSpecifier }: CardTooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        const { date, value } = payload[ 0 ].payload;
        return (
            <div className="Tooltip">
                <p>{ `Ημ/νία: ${date}` }</p>
                <p>{ `Ποσότητα: ${withCommas( value )}` } <Unit unit={ layoutSpecifier.unit }/></p>
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
                <p>{ `Μεταβολή: ${withCommas( Math.round( difference ) )} ` }
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
    items: ObjectType
} 

const TimelessTooltip = ( { active, payload, specifierCollection, items }: TimelessTooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        payload = payload[ 0 ].payload;

        const itemSpecifier: ValueSpecifier = specifierCollection.getByAxeX()[ 0 ];
        const valueSpecifier: ValueSpecifier = specifierCollection.getByAxeY()[ 0 ];

        const item: string = payload[ itemSpecifier.key ];
        const value: number = payload[ valueSpecifier.key ];

        return (
            <div className="Tooltip">
                <p>{ `${itemSpecifier[ 'label' ]}: ${items[ item ]}` }</p>
                <p>{ `${valueSpecifier[ 'label' ]}: ${withCommas( Math.round( value ) )} ` } 
                    <Unit unit={ valueSpecifier.unit }/>
                </p>
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
                <p>{ `${timeLabel( time )}: ${time}` }</p>
                <>
                { ySpecifiers.map( ( s, i ) => {
                    return ( 
                        <p key={i}>
                            <span>{s.label}: {Math.round( values[ i ] )} </span>
                            <Unit unit={ s.unit } />
                        </p> 
                    );
                } ) }
                </>
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
                            <td>Σύνολο</td> 
                            <td className='value'>{ withCommas( Math.round( total ) ) } <Unit unit={ sumSpecifier.unit }/></td>
                        </tr>
                        { legendRepr.map( ( item, i ) =>
                            <tr key={ i }>
                                <td>{ item.name }</td>
                                <td className='value'>{ withCommas( Math.round( item.value ) ) } m<sup>3</sup></td> 
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