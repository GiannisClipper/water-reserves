import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Customized } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

import { CardTooltip } from '@/components/page/chart/tooltips';

import { ChartLayoutHandler, EvaluationChartLayoutHandler } from '@/logic/LayoutHandler/chart/_abstract';

import type { ObjectType } from "@/types";

import "@/styles/chart.css";

type LineChartPropsType = { 
    data: ObjectType[]
    label: string
    layoutHandler: ChartLayoutHandler
};

const CardLineChart = ( { data, label, layoutHandler }: LineChartPropsType ) => {


    const WIDTH: number = 400;
    const HEIGHT: number = 240;

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
                    dataKey={ layoutHandler.xValueHandler.key }
                    ticks={ layoutHandler.xTicks } 
                    interval={ 0 } 
                    tick={ <XAxisTick ticks={ layoutHandler.xTicks } /> }
                />
                <YAxis
                    domain={ [ layoutHandler.minYTick, layoutHandler.maxYTick ] } 
                    ticks={ layoutHandler.yTicks }
                    interval={ 0 } 
                    tick={ <YAxisTick /> }
                />
                <Tooltip 
                    content={ <CardTooltip 
                        layoutHandler={ layoutHandler }
                    /> } 
                />
                <Customized
                    component={<BottomLabel height={ HEIGHT } label={ label } />}
                /> 

                { layoutHandler.yValueHandlers.map( ( handler, i ) =>
                    <Line 
                        key={ i }
                        type="monotone" 
                        dataKey={ handler.key }
                        stroke={ handler.color[ 500 ] } 
                        strokeWidth={ 2 }
                        dot={ false }
                        isAnimationActive={ true }
                    />
                ) }
            </LineChart>
        </div>
    );
}

type PieChartPropsType = { 
    centers: number[]
    cluster: number
    layoutHandler: EvaluationChartLayoutHandler
};

const CardPieChart = ( { centers, cluster, layoutHandler }: PieChartPropsType ) => {

    const WIDTH: number = 400;
    const HEIGHT: number = 200;

    const RADIAN = Math.PI / 180;

    type colorsType = { [ key: number ]: string[] };

    const colors: colorsType = {
        4: [
            layoutHandler.color[ 200 ],
            layoutHandler.color[ 300 ],
            layoutHandler.color[ 500 ],
            layoutHandler.color[ 600 ]
        ],

        5: [
            layoutHandler.color[ 200 ],
            layoutHandler.color[ 300 ],
            layoutHandler.color[ 400 ],
            layoutHandler.color[ 500 ],
            layoutHandler.color[ 600 ]
        ],

        6: [
            layoutHandler.color[ 200 ],
            layoutHandler.color[ 300 ],
            layoutHandler.color[ 400 ],
            layoutHandler.color[ 400 ],
            layoutHandler.color[ 500 ],
            layoutHandler.color[ 600 ]
        ]
    };

    const levelArc = 180 / centers.length;

    const data = centers.map( _ => ( { degrees: levelArc } ) );

    const level: number = ( cluster + 1) * levelArc - 0.5 * levelArc;

    const label = `Evaluation: ${cluster+1}/${centers.length} (${layoutHandler.evaluation[ cluster ]})`;

    const cx = WIDTH / 2;
    const cy = HEIGHT / 1.5;
    const iR = 70;
    const oR = 120;
    
    const needle = ( 
        level: number, cx: number, cy: number, iR: number, oR: number, color: string 
    ) => {

        let degrees = 180;

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
                    data={ data }
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
                    { colors[ centers.length ].map( ( color: string, i: number ) => <Cell key={ `cell-${i}` } fill={ color } /> ) }
                </Pie>

                { needle( level, cx, cy, iR, oR, '#966' ) }

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
