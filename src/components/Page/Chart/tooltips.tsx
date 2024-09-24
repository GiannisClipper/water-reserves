import type { ObjectType } from '@/types';
import { withCommas, withPlusSign } from '@/helpers/numbers';
import { timeLabel } from '@/helpers/time';

type SimpleTooltipPropsType = {
    active?: boolean
    payload?: any
} 

const SimpleTooltip = ( { active, payload }: SimpleTooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        const { time, value, difference, percentage } = payload[ 0 ].payload;

        return (
            <div className="Tooltip">
                <p>{ `${timeLabel( time )}: ${time}` }</p>
                <p>{ `Αποθέματα: ${withCommas( value )}` } m<sup>3</sup></p>
                <p>{ `Διαφορά: ${withCommas( difference )} (${withPlusSign( percentage )}%)` }</p>
            </div>
      );
    }
  
    return null;
};

type ComplexTooltipPropsType = {
    active?: boolean
    payload?: any
    items: ObjectType[]
    makeItemsRepr: CallableFunction
} 

const ComplexTooltip = ( { active, payload, items, makeItemsRepr }: ComplexTooltipPropsType ) => {

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

export { SimpleTooltip, ComplexTooltip };