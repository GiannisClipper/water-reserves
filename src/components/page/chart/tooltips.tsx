import { withCommas, withPlusSign } from '@/helpers/numbers';
import { timeLabel } from '@/helpers/time';

import type { ObjectType } from '@/types';
import type { UnitType } from '@/logic/ChartTexts';

type SingleTooltipPropsType = {
    active?: boolean
    payload?: any
    texts: ObjectType
} 

const Unit = ( { unit }: { unit: UnitType } ) => {
    if ( unit === 'm3' ) {
        return ( <>m<sup>3</sup></> );
    }
    return unit;
}

const SingleTooltip = ( { active, payload, texts }: SingleTooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        const { time, value, difference, percentage } = payload[ 0 ].payload;

        console.log( 'UNIT', texts.unit)
        return (
            <div className="Tooltip">
                <p>{ `${timeLabel( time )}: ${time}` }</p>
                <p>{ `Ποσότητα: ${withCommas( value )}` } <Unit unit={ texts.unit }/></p>
                <p>{ `Διαφορά: ${withCommas( difference )} (${withPlusSign( percentage )}%)` }</p>
            </div>
      );
    }
  
    return null;
};

type StackTooltipPropsType = {
    active?: boolean
    payload?: any
    items: ObjectType[]
    makeItemsRepr: CallableFunction
    texts: ObjectType
} 

const StackTooltip = ( { active, payload, items, makeItemsRepr, texts }: StackTooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        const { time, total, values } = payload[ 0 ].payload;

        const itemsRepr: ObjectType[] = makeItemsRepr( items, values );

        return (
            <div className="Tooltip">
                <p>{ `${timeLabel( time )}: ${time}` }</p>

                <table>
                    <tbody>
                        <tr className='total'>
                            <td>Σύνολο</td> 
                            <td className='value'>{ withCommas( total ) } <Unit unit={ texts.unit }/></td>
                        </tr>
                        { itemsRepr.map( ( reservoir, i ) =>
                            <tr key={ i }>
                                <td>{ reservoir.name }</td>
                                <td className='value'>{ withCommas( reservoir.value )} m<sup>3</sup></td> 
                                <td className='value'>{ `${reservoir.percentage}%` }</td>
                            </tr>
                        ) }
                    </tbody>
                </table>

            </div>
      );
    }
  
    return null;
};

export { SingleTooltip, StackTooltip };