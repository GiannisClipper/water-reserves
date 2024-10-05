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

type CardTooltipPropsType = {
    active?: boolean
    payload?: any
    metadataHandler: ObjectType
} 

const CardTooltip = ( { active, payload, metadataHandler }: CardTooltipPropsType ) => {

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

type TooltipPropsType = {
    active?: boolean
    payload?: any
    valueSpecifiers: ObjectType[]
} 

const SingleTooltip = ( { active, payload, valueSpecifiers }: TooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        payload = payload[ 0 ].payload;

        const time: ObjectType = valueSpecifiers.filter( s => s[ 'chartXY' ] === 'X' )[ 0 ];
        const value: ObjectType = valueSpecifiers.filter( s => s[ 'chartXY' ] === 'Y' )[ 0 ];
        const difference: ObjectType = valueSpecifiers.filter( s => s[ 'key' ] === `${value.key}_difference` )[ 0 ];;
        const percentage: ObjectType = valueSpecifiers.filter( s => s[ 'key' ] === `${value.key}_percentage` )[ 0 ];;

        const values = {
            time: payload[ time[ 'key' ] ],
            value: payload[ value[ 'key' ] ],
            difference: payload[ difference[ 'key' ] ],
            percentage: payload[ percentage[ 'key' ] ],
        }

        return (
            <div className="Tooltip">
                <p>{ `${timeLabel( values.time )}: ${values.time}` }</p>
                <p>{ `${value[ 'label' ]}: ${withCommas( values.value )} ` } 
                    <Unit unit={ value[ 'unit' ] }/>
                </p>
                <p>{ `Μεταβολή: ${withCommas( Math.round( values.difference ) )} ` }
                    <Unit unit={ value[ 'unit' ] }/>
                    { ` (${withPlusSign( values.percentage )}%)` }
                </p>
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

const MultiTooltip = ( { active, payload, valueSpecifiers }: TooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        payload = payload[ 0 ].payload;

        const timeSpecifier: ObjectType = valueSpecifiers.filter( s => s[ 'chartXY' ] === 'X' )[ 0 ];
        const ySpecifiers: ObjectType[] = valueSpecifiers.filter( s => s[ 'chartXY' ] === 'Y' );

        const values: ObjectType = {
            time: payload[ timeSpecifier[ 'key' ] ]
        }
        for ( const ySpecifier of ySpecifiers ) {
            values[ ySpecifier[ 'key'] ] = payload[ ySpecifier[ 'key' ] ]
        }

        return (
            <div className="Tooltip">
                <p>{ `${timeLabel( values.time )}: ${values.time}` }</p>
                <>
                { ySpecifiers.map( ( s, i ) => {
                    // const key = s[ 'key' ].split( '_' )[ 0 ];
                    // const label = valueSpecifiers.filter( s => s[ 'key' ] === key ).map( s => s[ 'label' ] )[ 0 ];
                    return ( <p key={i}>{ `${s[ 'label' ]}: ${values[ s[ 'key' ] ]} ${s[ 'unit' ]}` }</p> );
                } ) }
                </>
            </div>
      );
    }
  
    return null;
};

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

export { CardTooltip, SingleTooltip, StackTooltip, MultiTooltip };