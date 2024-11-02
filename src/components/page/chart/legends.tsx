import { useEffect } from "react";
import L from "leaflet";

import "@/styles/chart.css";

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

const MapLegend = ( { map } ) => {

    useEffect( () => {

        if ( ! map ) {
            return;
        }

        const legend = L.control( { position: "bottomleft" } );

        legend.onAdd = () => {
            const div = L.DomUtil.create( "div", "Legend");
            div.innerHTML =
                "<div><span>Lower</span></div>" +
                "<div><span>Low</span></div>" +
                "<div><span>Mid</span></div>" +
                "<div><span>High</span></div>" +
                "<div><span>Higher</span></div>";
            return div;
        };

        legend.addTo( map );

    }, [ map ] );

    return null;
}

export { StandardLegend, MapLegend };
