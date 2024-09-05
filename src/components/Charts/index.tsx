const CustomizedXAxisTick = props => {

    const { x, y, payload } = props;
  
    return (
      <g transform={`translate(${x-24},${y+16}) rotate(-45)`}>
        <text dy={16} textAnchor='middle' fill='#666'>{payload.value}</text>
      </g>
    );
}

export { CustomizedXAxisTick };