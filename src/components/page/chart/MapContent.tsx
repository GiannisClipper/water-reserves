"use client"

import { useRef } from 'react';
import { MapContainer, TileLayer, ZoomControl, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import "@/styles/chart.css";

const MapContent = () => {

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
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ZoomControl 
                    position="topright" 
                />
                <Marker position={position}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>

            </MapContainer>
        </div>
    );
}

export default MapContent;
