import type { ObjectType } from '@/types';

type ColorLegendPropsType = {
    payload?: any
    reservoirs: ObjectType[]
    colorsArray: string[]
}

const ColorLegend = ( { payload, reservoirs, colorsArray }: ColorLegendPropsType ) => {

    return (
        <div className='CustomizedLegend'>
            { reservoirs.map( ( r: ObjectType, i: number ) =>
                <span 
                    key={ i }
                    style={ { color: colorsArray[ i ] } }
                >
                    <svg height="10" width="15" xmlns="http://www.w3.org/2000/svg">
                        <g fill="none" stroke={ colorsArray[ i ] } strokeWidth="4">
                            <path d="M5 5 l15 0" />
                        </g>
                    </svg>
                    { r.name_el }
                </span>
            ) }
        </div>
    )
}

type LineLegendPropsType = {
    payload?: any
    reservoirs: ObjectType[]
    colorsArray: string[]
    strokeDasharray: string[]
}

const LineLegend = ( { payload, reservoirs, colorsArray, strokeDasharray }: LineLegendPropsType ) => {

    return (
        <div className='CustomizedLegend'>
            { reservoirs.map( ( r: ObjectType, i: number ) =>
                <span 
                    key={ i }
                    style={ { color: colorsArray[ 0 ] } }
                >
                    <svg height="10" width="25" xmlns="http://www.w3.org/2000/svg">
                        <g fill="none" stroke={ colorsArray[ 0 ] } strokeWidth="2">
                                <path strokeDasharray={ strokeDasharray[ i ] } d="M5 5 l25 0" />
                        </g>
                    </svg>
                    { r.name_el }
                </span>
            ) }
            <span
                style={ { color: colorsArray[ 0 ] } }
            >
                <svg height="10" width="25" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" stroke={ colorsArray[ 0 ] } strokeWidth="2">
                        <path d="M5 5 l25 0" />
                    </g>
                </svg>
                Σύνολο
            </span>
        </div>
    )
}

export { ColorLegend, LineLegend };
