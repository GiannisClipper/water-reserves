"use client"

import TimelessDataHandler from '@/logic/DataHandler/TimelessDataHandler';
import { MapContainer, TileLayer, ZoomControl, GeoJSON, Tooltip, Marker, Popup } from 'react-leaflet'
import { withCommas } from '@/helpers/numbers';
import 'leaflet/dist/leaflet.css'
import geojson from '@/geography/dhmoi_okxe_attica.json';

import type { ObjectType } from '@/types';

import "@/styles/chart.css";

const MyTooltip = props => {

    console.log( props );
    return <Tooltip>sticky Tooltip for Geojson</Tooltip>;
}

type PropsType = { 
    dataHandler: TimelessDataHandler
    chartType: string | undefined
    layoutSpecifier: ObjectType
}

const MapContent = ( { dataHandler, chartType, layoutSpecifier }: PropsType ) => {

    const municipalities: ObjectType = {}; 
    for ( const row of dataHandler._items ) {
        municipalities[ row.id ] = row;
    }

    const points: ObjectType = {}; 
    for ( const row of dataHandler.data ) {
        points[ row.municipality_id ] = row;
    }

    for ( const feature of geojson.features ) {
        const id: string = feature.properties.KWD_YPES;
        feature[ 'points' ] = 0
        feature[ 'population' ] = 0;
        feature[ 'perPoint' ] = 0
        if ( points[ id ] ) {
            feature[ 'points' ] = points[ id ].points;
            feature[ 'population' ] = municipalities[ id ].population;
            feature[ 'perPoint' ] = Math.round( municipalities[ id ].population / points[ id ].points );
        }
    }
 
    const setStyle = feature => {

        const color = feature.points
            ? 'red'
            : 'lightgreen';

        return { 
            weight: .25,
            color: color,
            opacity: 0.65
        };
    };
    
    const position: [ number, number ] = [ 37.98, 23.73 ];

    console.log( "rendering: MapContent..." )//, dataHandler.data, dataHandler._items, dataHandler );

    return (
        <div className="ChartContent">
            <MapContainer 
                center={ position } 
                zoom={ 10 } 
                zoomControl={ false }
                scrollWheelZoom={ false } 
                style={ { height: '100%' } }
                // attributionControl={ false }
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    // url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png"
                    url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                    // url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png"
                />
                <ZoomControl 
                    position="topright" 
                />
                { geojson.features.map( f => 
                    <GeoJSON
                        data={ f } 
                        style={setStyle} 
                    >
                        <Tooltip sticky>
                            <strong><p>Δήμος { f.properties.NAME }</p></strong>
                            <p>Συμβάντα διακοπής νερού: { withCommas( f.points) }</p>
                            <p>Σύνολο κατοίκων στο δήμο: { withCommas( f.population ) }</p>
                            <p>Ένα συμβάν για κάθε { withCommas( f.perPoint ) } κατοίκους.</p>
                        </Tooltip>
                    </GeoJSON>
                )}
                {/* <Marker position={position}>
                    <Popup>
                        A  <strong>customizable</strong> popup.
                    </Popup>
                </Marker> */}

            </MapContainer>
        </div>
    );
}

export default MapContent;
