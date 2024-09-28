const TopTitle = props => {

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

const XAxisLabel = props => {

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

const YAxisLabel = props => {

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

export { TopTitle, XAxisLabel, YAxisLabel };