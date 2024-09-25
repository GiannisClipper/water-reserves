import { withCommas, withPlusSign } from '@/helpers/numbers';
import { timeLabel } from '@/helpers/time';

import type { ObjectType } from '@/types';

type SingleTooltipPropsType = {
    active?: boolean
    payload?: any
} 

const SingleTooltip = ( { active, payload }: SingleTooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        const { time, value, difference, percentage } = payload[ 0 ].payload;

        return (
            <div className="Tooltip">
                <p>{ `${timeLabel( time )}: ${time}` }</p>
                <p>{ `Ποσότητα: ${withCommas( value )}` } m<sup>3</sup></p>
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
} 

const StackTooltip = ( { active, payload, items, makeItemsRepr }: StackTooltipPropsType ) => {

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
                            <td className='value'>{ withCommas( total ) } m<sup>3</sup></td>
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