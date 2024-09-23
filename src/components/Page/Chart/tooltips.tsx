import type { ObjectType } from '@/types';
import { withCommas, withPlusSign } from '@/helpers/numbers';
import { timeLabel } from '@/helpers/time';

type SimpleTooltipPropsType = {
    active?: boolean
    payload?: any
    label?: string
} 

const SimpleTooltip = ( { active, payload, label }: SimpleTooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        const { time, quantity, diff, percent } = payload[ 0 ].payload;

        return (
            <div className="Tooltip">
                <p>{ `${timeLabel( time )}: ${time}` }</p>
                <p>{ `Αποθέματα: ${withCommas( quantity )}` } m<sup>3</sup></p>
                <p>{ `Διαφορά: ${withCommas( diff )} (${withPlusSign( percent )}%)` }</p>
            </div>
      );
    }
  
    return null;
};

type ComplexTooltipPropsType = {
    active?: boolean
    payload?: any
    label?: string
    reservoirs: ObjectType[]
    makeReservoirsRepr: CallableFunction
} 

const ComplexTooltip = ( { active, payload, label, reservoirs, makeReservoirsRepr }: ComplexTooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        const { time, total, quantities } = payload[ 0 ].payload;

        const reservoirsRepr: ObjectType[] = makeReservoirsRepr( reservoirs, quantities );

        return (
            <div className="Tooltip">
                <p>{ `${timeLabel( time )}: ${time}` }</p>

                <table>
                    <tbody>
                        <tr className='total'>
                            <td>Σύνολο</td> 
                            <td className='value'>{ withCommas( total ) } m<sup>3</sup></td>
                        </tr>
                        { reservoirsRepr.map( ( reservoir, i ) =>
                            <tr key={ i }>
                                <td>{ reservoir.name }</td>
                                <td className='value'>{ withCommas( reservoir.quantity )} m<sup>3</sup></td> 
                                <td className='value'>{ `${reservoir.percent}%` }</td>
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