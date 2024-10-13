import { withCommas } from "@/helpers/numbers";

const XAxisTick = props => {

    const { x, y, payload, data, items } = props;

    // set the tick

    let tick: string = payload.value;

    if ( tick.length === 10 && data.length > 365 + 366 ) {
        tick = tick.substring( 0, 4 ); // reduce days to years 

    } else if ( tick.length === 10 && data.length > 31 * 2 ) {
        tick = tick.substring( 0, 7 ); // reduce days to months 

    } else if ( tick.length === 7 && data.length > 12 * 2 ) {
        tick = tick.substring( 0, 4 ); // reduce months to years
    }

    // set positioning params
    const dx = 3 * tick.length;
    const dy = Math.round( 2.75 * tick.length );
  
    return (
        <g transform={ `translate(${x-dx},${y+dy}) rotate(-60)` }>
          <text className='XTick'
            dy={ dy } textAnchor='middle' fill='#666'>{ tick }</text>
        </g>
    );
}

const XAxisTimelessTick = props => {

    let { x, y, payload, data, items } = props;

    // set the tick

    let tick: string = payload.value;
    tick = items[ tick ].slice( 0, 15 )

    // set positioning params
    const dx = 5;
    const dy = 3;
  
    return (
        <g transform={ `translate(${x-dx},${y+dy}) rotate(60)` }>
          <text className='XTick'
            dy={ dy } textAnchor='left' fill='#666'>{ tick }</text>
        </g>
    );
}

const YAxisTick = props => {

  const { x, y, payload, data } = props;

  // set the tick
  let tick: string = '';
  try { tick = withCommas( payload.value < 1000 ? payload.value : parseInt( payload.value ) ); } catch ( e ) {};
  
  // set positioning params
  const dx = -3 * tick.length - 2;
  const dy = 2;

  return (
      <g transform={ `translate(${x+dx},${y+dy}) rotate(0)` }>
        <text className='YTick'
          dy={ dy } textAnchor='middle' fill='#666'>{ tick }</text>
      </g>
  );
}

export { XAxisTick, XAxisTimelessTick, YAxisTick };

