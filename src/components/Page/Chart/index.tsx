import { withCommas } from "@/helpers/numbers";

const CustomTitle = props => {

    const { title } = props;
    return (
        <g transform={ `translate(0,0) rotate(0)` }>
        <text 
            className='ChartTitle' 
            x={'50%'} 
            y={30} 
            textAnchor="middle" 
            fontWeight="bold"
        >
            { title }
        </text>
        </g>
    );
}

const CustomizedXAxisTick = props => {

    const { x, y, payload, data } = props;

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

const CustomizedYAxisTick = props => {

  const { x, y, payload, data } = props;

  // set the tick
  let tick: string = '';
  try { tick = withCommas( parseInt( payload.value ) ); } catch ( e ) {};
  
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

const CustomizedXAxisLabel = props => {

    const { viewBox: { width, height, x, y }, label } = props;
    const dx = width *.5;
    const dy = height * 2.75;

    return (
        <g transform={ `translate(${x},${y}) rotate(0)` }>
          <text className='YLabel'
            dx={ dx } dy={ dy } textAnchor='middle' fill='#999'>{ label }</text>
        </g>
    );
}

const CustomizedYAxisLabel = props => {

    const { viewBox: { width, height, x, y }, label } = props;
    const dx = - height * .5;
    const dy = - y * .25;
      
    return (
        <g transform={ `translate(${x},${y}) rotate(-90)` }>
          <text className='YLabel'
            dx={ dx } dy={ dy } textAnchor='middle' fill='#999'>{ label }</text>
        </g>
    );
}

export { 
    CustomTitle,
    CustomizedXAxisTick, CustomizedYAxisTick, 
    CustomizedXAxisLabel, CustomizedYAxisLabel,
};