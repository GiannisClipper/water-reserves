"use client"

import { useState } from 'react';

import { MapContainer, TileLayer, ZoomControl, GeoJSON, Tooltip, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from "leaflet";
import { MapLegend } from './legends';

import geojson from '@/geography/dhmoi_okxe_attica.json';
import { SpatialInterruptionsStandardChartLayoutHandler } from '@/logic/LayoutHandler/chart/interruptions';
import { withCommas } from '@/helpers/numbers';
import type { ObjectType } from '@/types';

import 'leaflet/dist/leaflet.css'
import "@/styles/chart.css";

type PropsType = { 
    dataBox: ObjectType
    layoutHandler: SpatialInterruptionsStandardChartLayoutHandler
    chartType: string | undefined
}

const MapContent = ( { dataBox, chartType, layoutHandler }: PropsType ) => {

    const nameValueHandler = layoutHandler.nameValueHandler;
    const areaValueHandler = layoutHandler.areaValueHandler;
    const populationValueHandler = layoutHandler.populationValueHandler;
    const eventsValueHandler = layoutHandler.eventsValueHandler;
    const eventsOverAreaValueHandler = layoutHandler.eventsOverAreaValueHandler;
    const eventsOverPopulationValueHandler = layoutHandler.eventsOverPopulationValueHandler;

    const municipalities: ObjectType = {}; 
    if ( dataBox.legend ) {
        for ( const row of dataBox.legend[ 'municipalities' ] ) {
            municipalities[ row.id ] = row;
        }
    }

    const events: ObjectType = {}; 
    for ( const row of dataBox.data ) {
        events[ row.municipality_id ] = row;
    }

    for ( const feature of geojson.features as ObjectType[] ) {

        const id: string = feature.properties.KWD_YPES;

        feature[ 'events' ] = 0;
        feature[ 'name' ] = municipalities[ id ] && municipalities[ id ][ 'name_en' ];
        feature[ 'area' ] = 0;
        feature[ 'population' ] = 0;
        feature[ 'events_over_population' ] = 0;
        feature[ 'events_over_area' ] = 0;
        feature[ 'lat' ] = municipalities[ id ] && municipalities[ id ][ 'lat' ];
        feature[ 'lon' ] = municipalities[ id ] && municipalities[ id ][ 'lon' ];

        if ( events[ id ] ) {
            feature[ 'events' ] = events[ id ][ 'events' ];
            // feature[ 'name' ] = events[ id ][ 'name' ];
            feature[ 'area' ] = events[ id ][ 'area' ];    
            feature[ 'population' ] = events[ id ][ 'population' ];
            feature[ 'events_over_area' ] = events[ id ][ 'events_over_area' ];
            feature[ 'events_over_population' ] = events[ id ][ 'events_over_population' ];

            const cluster: number = events[ id ][ 'cluster' ];
            const clusterName: string = [ 'lower', 'low', 'mid', 'high', 'higher' ][ cluster ];
            feature[ 'cluster' ] = cluster;
            feature[ 'clusterRepr' ] = `${cluster + 1} (${clusterName})`;
        }
    }
 
    const setStyle = feature => {

        const clusterColors: string[] = [ '#ffcc11', '#ff9811', '#ff7599', '#ff4299', '#ff0000' ];

        const color: string = feature.events
            ? clusterColors[ feature.cluster ]
            : 'transparent';

        return { 
            stroke: true,
            weight: .25, // effects on polygon lines
            color: 'black',
            opacity: 0.65, // effects on polygon lines
            fillOpacity: 0.30, // effects on polygon lines
            fillColor: color,
        };
    };

    const [ map, setMap ] = useState( null );

    const [ zoom, setZoom ] = useState( 12 );

    const mapCenter: [ number, number ] = [ 37.98, 23.73 ];

    type MapHandlerPropsType = { setZoom: CallableFunction }

    const MapHandler = ( { setZoom }: MapHandlerPropsType ) => {

        const map = useMapEvents( {
            zoomend: () => setZoom( map.getZoom() ) 
        } )

        return null
    }

    const getFontSize = ( zoom: number ): number => 
        zoom <= 9
        ? 0
        : zoom <= 10
        ? .75
        : zoom <= 11
        ? .85
        : zoom <= 12
        ? 1
        : zoom <= 13
        ? 1.2
        : zoom <= 14
        ? 1.4
        : 1.6;

        console.log( "rendering: MapContent...", geojson.features )//, dataBox.data );
    
    return (
        <div 
            className="ChartContent MapContent"
        >
            <MapContainer 
                center={ mapCenter } 
                zoom={ zoom } 
                zoomControl={ false }
                scrollWheelZoom={ false } 
                style={ { height: '100%' } }
                // attributionControl={ false }
                ref={ setMap }
            >

                <MapHandler 
                    setZoom={ setZoom }
                />

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

                <MapLegend map={ map } />

                { geojson.features.map( ( f: any, i: number ) => 
                    f.name 
                    ?
                    <GeoJSON
                        key={ i }
                        data={ f } 
                        style={ setStyle } 
                    >
                        <Marker
                            position={[ f.lat || 37.98, f.lon || 23.73 + i* (0.01) ]}
                            icon={ new L.DivIcon( { // https://www.wrld3d.com/wrld.js/latest/docs/leaflet/L.DivIcon/
                                className: `Text`,
                                html: `<p style="font-size:${getFontSize( zoom )}em">
                                    ${f.name && f.name.replaceAll( ' - ', '-' ).replace( '. ', '.' )}
                                </p>`
                            } ) }
                        >
                        <Tooltip>
                            <div className='Tooltip Map'>
                                <strong>
                                    <div>{ nameValueHandler.label } of { f.name }</div>
                                </strong>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>{ eventsValueHandler.label }</td>
                                            <td>{ withCommas( f.events ) }</td>
                                        </tr>
                                        <tr>
                                            <td>{ areaValueHandler.label }</td>
                                            <td>{ withCommas( f.area ) }</td>
                                        </tr>
                                        <tr>
                                            <td>{ eventsOverAreaValueHandler.label }</td>
                                            <td>{ withCommas( Math.round( f.events_over_area * 10 ) / 10 ) }</td>
                                        </tr>
                                        <tr>
                                            <td>{ populationValueHandler.label }</td>
                                            <td>{ withCommas( f.population ) }</td>
                                        </tr>                                        
                                        <tr>
                                            <td>{ eventsOverPopulationValueHandler.label }</td>
                                            <td>{ withCommas( Math.round( f.events_over_population * 10 ) / 10 ) }</td>
                                        </tr>
                                        <tr>
                                            <td>{ 'Evaluation' }</td>
                                            <td>{ f.clusterRepr }</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Tooltip>
                        </Marker>

                    </GeoJSON>
                    :
                    null
                ) }
            </MapContainer>
        </div>
    );
}

export default MapContent;
