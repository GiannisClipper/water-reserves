const CustomizedXAxisTick = props => {

    const { x, y, payload, data } = props;
    console.log( 'data.length', data.length )
    // set the tick
    let tick: string = payload.value;

    if ( tick.length === 10 && data.length > 31 ) {
      tick = tick.substring( 0, 7 ); // reduce days to months 
    }

    if ( tick.length === 7 && data.length > 24 ) {
      tick = tick.substring( 0, 4 ); // reduce months to years
    }

    // set positioning params
    let dx = 30, dy = 22;

    if ( tick.length === 7 ) { // case of month tick
      dx = 20, dy = 18;
    }

    if ( tick.length === 4 ) { // case of year tick
      dx = 10, dy = 12;
    }

    return (
      <g transform={`translate(${x-dx},${y+dy}) rotate(-60)`}>
        <text dy={ dy } textAnchor='middle' fill='#666'>{ tick }</text>
      </g>
    );
}

export { CustomizedXAxisTick };