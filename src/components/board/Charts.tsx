import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Customized } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

import { calcTicks } from '@/helpers/ticks';
import { CardTooltip } from '@/components/page/chart/tooltips';

import { LayoutSpecifier } from '@/logic/LayoutSpecifier';

import type { ObjectType } from "@/types";

type LineChartPropsType = { 
    data: ObjectType[]
    label: string
    layoutSpecifier: LayoutSpecifier
};

import "@/styles/chart.css";

const CardLineChart = ( { data, label, layoutSpecifier }: LineChartPropsType ) => {

    const color = layoutSpecifier.colors[ 0 ]

    const WIDTH: number = 400;
    const HEIGHT: number = 240;

    const yTicks: number[] = calcTicks( data.map( d => d.value ), 2 );

    return (
        <div className='CardLineChart'>
            <LineChart
                width={ WIDTH }
                height={ HEIGHT }
                data={ data }
                margin={ { top: 20, right: 15, left: 15, bottom: 55 } }
            >
                <CartesianGrid strokeDasharray="1 1" />
                <XAxis 
                    dataKey="date" 
                    ticks={ data.map( d => d.date ) } 
                    interval={ 0 } 
                    tick={ <XAxisTick ticks={ data.map( d => d.date ) } /> }
                />
                <YAxis
                    domain={ [ yTicks[ 0 ], yTicks[ yTicks.length - 1 ] ] } 
                    dataKey="value"
                    ticks={ yTicks }
                    interval={ 0 } 
                    tick={ <YAxisTick /> }
                />
                <Tooltip 
                    content={ <CardTooltip 
                        layoutSpecifier={ layoutSpecifier }
                    /> } 
                />
                <Customized
                    component={<BottomLabel height={ HEIGHT } label={ label } />}
                /> 

                <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={ color[ 500 ] } 
                    strokeWidth={ 2 } 
                    dot={ false }
                    isAnimationActive={ true }
                />
            </LineChart>
        </div>
    );
}

type PieChartPropsType = { 
    cluster: number
    label: string
    layoutSpecifier: LayoutSpecifier
};

const CardPieChart = ( { cluster, label, layoutSpecifier }: PieChartPropsType ) => {

    const color = layoutSpecifier.colors[ 0 ]

    const WIDTH: number = 400;
    const HEIGHT: number = 200;

    const RADIAN = Math.PI / 180;

    const levels = [
        { name: 'lower', degrees: 36, color: color[ 200 ] },
        { name: 'low', degrees: 36, color: color[ 300 ] },
        { name: 'mid', degrees: 36, color: color[ 400 ] },
        { name: 'high', degrees: 36, color: color[ 500 ] },
        { name: 'higher', degrees: 36, color: color[ 600 ] },
    ];

    const level: number = ( cluster + 1) * 36 -18;

    const cx = WIDTH / 2;
    const cy = HEIGHT / 1.5;
    const iR = 70;
    const oR = 120;
    
    const needle = ( 
        level: number, levels: ObjectType, cx: number, cy: number, iR: number, oR: number, color: string 
    ) => {

        let degrees = 0;
        levels.forEach( ( l: ObjectType ) => { degrees += l.degrees; } );
        // const degrees = levels.reduce( ( a: ObjectType, b: ObjectType ) => a.degrees + b.degrees, 0 );

        const ang = 180.0 * ( 1 - level / degrees );
        const length = ( iR + 2 * oR ) / 3;
        const sin = Math.sin( -RADIAN * ang );
        const cos = Math.cos( -RADIAN * ang );
        const r = 5;
        const x0 = cx + 5;
        const y0 = cy + 5;
        const xba = x0 + r * sin;
        const yba = y0 - r * cos;
        const xbb = x0 - r * sin;
        const ybb = y0 + r * cos;
        const xp = x0 + length * cos;
        const yp = y0 + length * sin;
        
        return [
            <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
            <path d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="#none" fill={color} />,
        ];
    };
    
    return (
        <div className='CardPieChart'>
            <PieChart 
                width={ WIDTH } 
                height={ HEIGHT }
            >
                <Pie
                    dataKey="degrees"
                    startAngle={ 180 }
                    endAngle={ 0 }
                    data={ levels }
                    cx={ cx }
                    cy={ cy }
                    innerRadius={ iR }
                    outerRadius={ oR }
                    fill="#8884d8"
                    stroke="none"
                    isAnimationActive={ false }
                    // disable animation to bypass error: Hydration failed because 
                    // the initial UI does not match what was rendered on the server.
                >
                    { levels.map( ( row: ObjectType, i: number ) => <Cell key={ `cell-${i}` } fill={ row.color } /> ) }
                </Pie>

                { needle( level, levels, cx, cy, iR, oR, '#966' ) }

                <Customized
                    component={<BottomLabel height={ HEIGHT } label={ label } />}
                />

            </PieChart>
        </div>
    );
}

const XAxisTick = props => {

    const { x, y, payload, ticks } = props;

    // set the tick
    let tick: string = payload.value;

    const anchor: string = 
        tick === ticks[ 0 ] 
        ? 'start' 
        : tick === ticks[ ticks.length - 1 ]
        ? 'end'
        : 'middle';

    // keep day/month only
    tick = tick === ticks[ 0 ] || tick === ticks[ ticks.length - 1 ]
        ? tick.substring( 5 ).split( '-' ).reverse().join( '/' )
        : '';
  
    return (
        <g transform={ `translate(${x},${y}) rotate(0)` }>
          <text className='XTick'
            dx={ 0 } dy={ 15 } textAnchor={ anchor} fill='#678'>{ tick }</text>
        </g>
    );
}

const YAxisTick = props => {

    const { x, y, payload, ticks } = props;

    const tick: number = payload.value;

    const tickRepr = tick >= 10000
        ? tick.toExponential( 2 )
        : tick + '';

    // set positioning params
    const dx = -4 * tickRepr.length;
    const dy = 2;
  
    return (
        <g transform={ `translate(${x+dx},${y+dy}) rotate(0)` }>
          <text className='YTick'
            dy={ dy } textAnchor='middle' fill='#678'>{ tickRepr }</text>
        </g>
    );
}
  
const BottomLabel = props => {

    const { height, label } = props;

    return (
        <g transform={ `translate(0,${ height }) rotate(0)` }>
        <text 
            className='ChartLabel'
            x={ '50%' } 
            y={ -20 } 
            textAnchor="middle" fill='#678'
            // fontWeight="bold"
        >
            { label }
        </text>
        </g>
    );
}


export { CardLineChart, CardPieChart };
