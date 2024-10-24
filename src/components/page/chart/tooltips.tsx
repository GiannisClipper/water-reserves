import { Unit } from "@/components/Unit";

import { withCommas, withPlusSign } from '@/helpers/numbers';
import { timeLabel } from '@/helpers/time';
import { ChartHandler } from "@/logic/ChartHandler";
import { 
    MinimalChartLayoutHandler, 
    SingleChartLayoutHandler, 
    MultiChartLayoutHandler, 
    ChartLayoutHandler,
    StackChartLayoutHandler
} from "@/logic/LayoutHandler/chart";
import { SpatialInterruptionsSingleChartLayoutHandler } from "@/logic/LayoutHandler/chart/InterruptionsChartLayoutHandler";

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

type SingleTooltipPropsType = {
    active?: boolean
    payload?: any
    layoutHandler: SingleChartLayoutHandler
} 

const SingleTooltip = ( { active, payload, layoutHandler }: SingleTooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        payload = payload[ 0 ].payload;

        const time = layoutHandler.xValueHandler;
        const value = layoutHandler.yValueHandlers[ 0 ];
        const difference = layoutHandler.yDifferenceValueHandlers[ 0 ];
        const growth = layoutHandler.yChangeValueHandlers[ 0 ];

        return (
            <div className="Tooltip">
                <p>{ `${timeLabel( time.readFrom( payload ) )}: ${time.readFrom( payload )}` }</p>
                <p>{ `${value.label}: ${withCommas( value.readFrom( payload ) )} ` } 
                    <Unit unit={ value.unit }/>
                </p>
                <p>{ `Change: ${withCommas( Math.round( difference.readFrom( payload ) ) )} ` }
                    <Unit unit={ difference.unit }/>
                    { ` (${withPlusSign( growth.readFrom( payload ) )}%)` }
                </p>
            </div>
      );
    }
  
    return null;
};

type MultiTooltipPropsType = {
    active?: boolean
    payload?: any
    layoutHandler: MultiChartLayoutHandler
} 

const MultiTooltip = ( { active, payload, layoutHandler }: MultiTooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        payload = payload[ 0 ].payload;

        const time = layoutHandler.xValueHandler;

        const values: ObjectType[] = layoutHandler.yValueHandlers.map( h => ( {
            label: h.label,
            value: h.readFrom( payload ),
            unit: h.unit,
        } ) ).sort( ( a, b ) => b.value - a.value );

        return (
            <div className="Tooltip">
                <table>
                    <tbody>
                        <tr>
                            <td>{ timeLabel( time.readFrom( payload ) ) }</td>
                            <td>{ time.readFrom( payload ) }</td>
                        </tr>
                        { values.map( ( v, i ) => {
                            return ( 
                                <tr key={i}>
                                    <td>{ v.label }</td>
                                    <td>{ v.value } <Unit unit={ v.unit } /></td>
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
    layoutHandler: StackChartLayoutHandler
    sortFunc?: CallableFunction
} 

const StackTooltip = ( { active, payload, layoutHandler, sortFunc }: StackTooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        payload = payload[ 0 ].payload;

        const time = layoutHandler.xValueHandler;
        const total = layoutHandler.yValueHandlers[ layoutHandler.yValueHandlers.length -1 ];

        const result: ObjectType[] = [];
        for ( const handler of layoutHandler.yValueHandlers.slice( 0, -1 ) ) {
            result.push( {
                label: handler.label,
                value: handler.readFrom( payload ),
                unit: handler.unit,
            } );
        }
        for ( let i = 0; i < layoutHandler.yPercentageValueHandlers.length; i++ ) {
            result[ i ].percentage = layoutHandler.yPercentageValueHandlers[ i ].readFrom( payload )
        }

        if ( sortFunc ) {
            sortFunc( result )
        }
        // result.sort( ( a, b ) => b.value - a.value );

        return (
            <div className="Tooltip">
                <p>{ `${timeLabel( time.readFrom( payload ) )}: ${time.readFrom( payload )}` }</p>

                <table>
                    <tbody>
                        <tr className='total'>
                            <td>Total</td> 
                            <td className='value'>{ withCommas( Math.round( total.readFrom( payload ) ) ) } <Unit unit={ total.unit }/></td>
                        </tr>
                        { result.map( ( row, i ) =>
                            <tr key={ i }>
                                <td>{ row.label }</td>
                                <td className='value'>{ withCommas( Math.round( row.value ) ) } <Unit unit={ row.unit }/></td> 
                                <td className='value'>{ `${row.percentage} %` }</td>
                            </tr>
                        ) }
                    </tbody>
                </table>

            </div>
      );
    }
    return null;
};

type SpatialInterruptionsTooltipPropsType = {
    active?: boolean
    payload?: any
    layoutHandler: SpatialInterruptionsSingleChartLayoutHandler
} 

const SpatialInterruptionsTooltip = ( { active, payload, layoutHandler }: SpatialInterruptionsTooltipPropsType ) => {

    if ( active && payload && payload.length ) {

        payload = payload[ 0 ].payload;

        const name = layoutHandler.nameValueHandler;
        const area = layoutHandler.areaValueHandler;
        const population = layoutHandler.populationValueHandler;
        const events = layoutHandler.eventsValueHandler;
        const overArea = layoutHandler.eventsOverAreaValueHandler;
        const overPopulation = layoutHandler.eventsOverPopulationValueHandler;

        return (
            <div className="Tooltip">
                <strong>
                    <div>{ name.label } of { name.readFrom( payload ) }</div>
                </strong>
                <table>
                    <tbody>
                    <tr>
                        <td>{ events.label }</td>
                            <td>{ withCommas( events.readFrom( payload ) ) }</td>
                        </tr>
                        <tr>
                            <td>{ area.label }</td>
                            <td>{ withCommas( area.readFrom( payload ) ) } <Unit unit={ area.unit }/></td>
                        </tr>
                        <tr>
                            <td>{ overArea.label }</td>
                            <td>{ withCommas( Math.round( overArea.readFrom( payload ) * 10 ) / 10 ) }</td>
                        </tr>
                        <tr>
                            <td>{ population.label }</td>
                            <td>{ withCommas( population.readFrom( payload ) ) }</td>
                        </tr>
                        <tr>
                            <td>{ overPopulation.label }</td>
                            <td>{ withCommas( Math.round( overPopulation.readFrom( payload ) * 10 ) / 10 ) }</td>
                        </tr>
                    </tbody>
                </table>
            </div>
      );
    }
  
    return null;
};


export { 
    CardTooltip, SingleTooltip, MultiTooltip, 
    StackTooltip,
    SpatialInterruptionsTooltip
};