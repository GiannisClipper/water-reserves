import { withCommas, withPlusSign } from '@/helpers/numbers';
import { timeLabel } from '@/helpers/time';

import type { ObjectType } from '@/types';
import type { UnitType } from '@/logic/MetadataHandler';

const Unit = ( { unit }: { unit: UnitType } ) => {
    if ( unit === 'm3' ) {
        return ( <>m<sup>3</sup></> );
    }
    return unit;
}

type TooltipPropsType = {
    active?: boolean
    payload?: any
    metadataHandler: ObjectType
} 

const CardTooltip = ( { active, payload, metadataHandler }: TooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        const { date, value } = payload[ 0 ].payload;
        return (
            <div className="Tooltip">
                <p>{ `Ημ/νία: ${date}` }</p>
                <p>{ `Ποσότητα: ${withCommas( value )}` } <Unit unit={ metadataHandler._unit }/></p>
            </div>
      );
    }
  
    return null;
};

const SingleTooltip = ( { active, payload, metadataHandler }: TooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        const { time, value, difference, percentage } = payload[ 0 ].payload;

        return (
            <div className="Tooltip">
                <p>{ `${timeLabel( time )}: ${time}` }</p>
                <p>{ `Ποσότητα: ${withCommas( value )}` } <Unit unit={ metadataHandler.unit }/></p>
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
    metadataHandler: ObjectType
} 

const StackTooltip = ( { active, payload, items, makeItemsRepr, metadataHandler }: StackTooltipPropsType ) => {

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
                            <td className='value'>{ withCommas( total ) } <Unit unit={ metadataHandler.unit }/></td>
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

type MultiTooltipPropsType = {
    active?: boolean
    payload?: any
    valueLabels: string[]
    valueKeys: string[]
} 

const MultiTooltip = ( { active, payload, valueLabels, valueKeys }: MultiTooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        const { time } = payload[ 0 ].payload;

        return (
            <div className="Tooltip">
                <p>{ `${timeLabel( time )}: ${time}` }</p>
                <>
                { valueLabels.map( ( label, i ) => {
                    const value = payload[ 0 ].payload[ valueKeys[ i ] ];
                    return ( <p key={i}>{ `${label}: ${value} %` }</p> );
                } ) }
                </>
            </div>
      );
    }
  
    return null;
};

export { CardTooltip, SingleTooltip, StackTooltip, MultiTooltip };