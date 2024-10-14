"use client"

import { useRef } from 'react';
import { MapContainer, TileLayer, ZoomControl, GeoJSON, Polygon, Marker, Popup, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import geojson from '@/geography/dhmoi_okxe_attica.json';

import "@/styles/chart.css";

const MyTooltip = props => {

    console.log( props );
    return <Tooltip>sticky Tooltip for Geojson</Tooltip>;
}

const MapContent = () => {

    const setStyle = feature => {
        return { 
            weight: .25,
            color: "red",
            opacity: 0.65
        };
    };
    
    const position: [ number, number ] = [ 37.98, 23.73 ];

    console.log( "rendering: ChartContent..." )// , metadataHandler );

    return (
        <div className="ChartContent">
            <MapContainer 
                center={ position } 
                zoom={ 12 } 
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
                            <p>Συμβάντα: 0</p>
                            <p>Κάτοικοι: 0</p>
                            <p>Κάτοικοι ανά συμβάν: 0</p>
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
