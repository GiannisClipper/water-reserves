"use client"

import { useState } from 'react';

import { MapContainer, TileLayer, ZoomControl, GeoJSON, Tooltip, Marker, Popup } from 'react-leaflet'

import ValueSpecifierCollection from '@/logic/ValueSpecifier/ValueSpecifierCollection';
import { ValueSpecifier } from '@/logic/ValueSpecifier';

import { withCommas } from '@/helpers/numbers';
import type { ObjectType } from '@/types';

import geojson from '@/geography/dhmoi_okxe_attica.json';

import { ChartLayoutHandler } from '@/logic/LayoutHandler/chart';

import { SingleTimelessDataHandler } from '@/logic/DataHandler/SingleDataHandler';

import 'leaflet/dist/leaflet.css'
import "@/styles/chart.css";

type PropsType = { 
    dataHandler: SingleTimelessDataHandler
    layoutHandler: ChartLayoutHandler
    chartType: string | undefined
}

const MapContent = ( { dataHandler, chartType, layoutHandler }: PropsType ) => {

    const specifierCollection: ValueSpecifierCollection = dataHandler.specifierCollection;

    const municipalitySpecifier: ValueSpecifier = specifierCollection.getByAxeX()[ 0 ];
    const nameSpecifier: ValueSpecifier = specifierCollection.getByKey( 'name' );
    const areaSpecifier: ValueSpecifier = specifierCollection.getByKey( 'area' );
    const populationSpecifier: ValueSpecifier = specifierCollection.getByKey( 'population' );
    const eventsSpecifier: ValueSpecifier = specifierCollection.getByKey( 'events' );
    const overAreaSpecifier: ValueSpecifier = specifierCollection.getByKey( 'events_over_area' );
    const overPopulationSpecifier: ValueSpecifier = specifierCollection.getByKey( 'events_over_population' );
    const clusterSpecifier: ValueSpecifier = specifierCollection.getByKey( 'cluster' );

    const municipalities: ObjectType = {}; 
    if ( dataHandler.legend ) {
        for ( const row of dataHandler.legend[ 'municipalities' ] ) {
            municipalities[ row.id ] = row;
        }
    }

    const events: ObjectType = {}; 
    for ( const row of dataHandler.data ) {
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

        if ( events[ id ] ) {
            feature[ 'events' ] = events[ id ][ 'events' ];
            // feature[ 'name' ] = events[ id ][ 'name' ];
            feature[ 'area' ] = events[ id ][ 'area' ];    
            feature[ 'population' ] = events[ id ][ 'population' ];
            feature[ 'events_over_area' ] = events[ id ][ 'events_over_area' ];
            feature[ 'events_over_population' ] = events[ id ][ 'events_over_population' ];

            const cluster: number = events[ id ][ 'cluster' ];
            const clusterName: string = [ 'low', 'mid', 'high' ][ cluster ];
            feature[ 'cluster' ] = cluster;
            feature[ 'clusterRepr' ] = `${cluster + 1} (${clusterName})`;
        }
    }
 
    const setStyle = feature => {

        const clusterColors: string[] = [ '#ffcc11', '#ff6699', '#ff0000' ];

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
    
    const [ showTooltip, setShowTooltip ] = useState( false );

    const position: [ number, number ] = [ 37.98, 23.73 ];

    console.log( "rendering: MapContent..." )//, dataHandler.data );

    return (
        <div 
            className="ChartContent MapContent"
            onClick={ () => setShowTooltip( ! showTooltip ) }
        >
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
                { geojson.features.map( ( f: any, i: number ) => 
                    <GeoJSON
                        key={ i }
                        data={ f } 
                        style={ setStyle } 
                    >
                        <Tooltip sticky>
                            <div className='Tooltip Map'>
                                { ! showTooltip 
                                ?
                                <div>{ municipalitySpecifier[ 'label'] } of { f.name }</div>
                                :
                                <>
                                <strong>
                                    <div>{ municipalitySpecifier[ 'label'] } of { f.name }</div>
                                </strong>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>{ eventsSpecifier[ 'label'] }</td>
                                            <td>{ withCommas( f.events ) }</td>
                                        </tr>
                                        <tr>
                                            <td>{ areaSpecifier[ 'label'] }</td>
                                            <td>{ withCommas( f.area ) }</td>
                                        </tr>
                                        <tr>
                                            <td>{ overAreaSpecifier[ 'label'] }</td>
                                            <td>{ withCommas( Math.round( f.events_over_area * 10 ) / 10 ) }</td>
                                        </tr>
                                        <tr>
                                            <td>{ populationSpecifier[ 'label'] }</td>
                                            <td>{ withCommas( f.population ) }</td>
                                        </tr>                                        <tr>
                                            <td>{ overPopulationSpecifier[ 'label'] }</td>
                                            <td>{ withCommas( Math.round( f.events_over_population * 10 ) / 10 ) }</td>
                                        </tr>
                                        <tr>
                                            <td>{ clusterSpecifier[ 'label'] }</td>
                                            <td>{ f.clusterRepr }</td>
                                        </tr>
                                    </tbody>
                                </table>
                                </>
                            }
                            </div>
                        </Tooltip>
                    </GeoJSON>
                ) }
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
