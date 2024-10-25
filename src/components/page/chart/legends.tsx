import { ValueSpecifier } from '@/logic/ValueSpecifier';
import ValueSpecifierCollection from '@/logic/ValueSpecifier/ValueSpecifierCollection';
import type { ObjectType } from '@/types';

type StandardLegendPropsType = {
    payload?: any
    labels: string[]
    colors: string[]
    dashes?: string[]
}

const StandardLegend = ( { payload, labels, colors, dashes }: StandardLegendPropsType ) => {

    return (
        <div className='CustomizedLegend'>
            { labels.map( ( l: string, i: number ) =>
                <span 
                    key={ i }
                    style={ { color: colors[ i ] } }
                >
                    <svg height="10" width="15" xmlns="http://www.w3.org/2000/svg">
                        <g fill="none" stroke={ colors[ i ] } strokeWidth="4">
                            { dashes
                            ? <path strokeDasharray={ dashes[ i ] } d="M5 5 l25 0" />
                            : <path d="M5 5 l15 0" />
                            }
                        </g>
                    </svg>
                    { labels[ i ] }
                </span>
            ) }
        </div>
    )
}

export { StandardLegend };
