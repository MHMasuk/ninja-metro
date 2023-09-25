"use client";

import React, { useState, useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { COORDINATE_SYSTEM, _GlobeView as GlobeView, MapView } from '@deck.gl/core';
import Map from 'react-map-gl/maplibre';
import chroma from 'chroma-js';

import ColorRemapBitmapLayer from '@/app/components/CustomLayers/ColorRemapBitmapLayer';

const MainMapDemo = () => {
    const [rgbColors, setRgbColors] = useState([]);
    const [isGlobeView, setIsGlobeView] = useState(true); // Track the current view mode

    const initialGlobeViewState = {
        width: 500,
        height: 500,
        longitude: 0, // Set the initial longitude for the globe view
        latitude: 0,  // Set the initial latitude for the globe view
        zoom: 2,      // Set the initial zoom level for the globe view
        maxZoom: 16,
    };

    const initialMapViewState = {
        width: 500,
        height: 500,
        longitude: 90.3563, // Set the initial longitude for the map view
        latitude: 23.6850,  // Set the initial latitude for the map view
        zoom: 4,            // Set the initial zoom level for the map view
        maxZoom: 16,
    };

    const handleToggleViewMode = () => {
        setIsGlobeView((prevIsGlobeView) => !prevIsGlobeView);
    };

    useMemo(() => {
        // Initialize colors
        const colors = chroma
            .scale(['#5e4fa2', '#555ba8', '#4c66ad', '#4372b3', '#3a7eb8', '#3389bd', '#3e95b8', '#48a1b3', '#53adae', '#5eb9a9', '#69c3a5', '#77c9a5', '#85cea5', '#93d4a4', '#a1d9a4', '#afdea3', '#bbe3a1', '#c7e89e', '#d3ed9c', '#dff299', '#e8f69b', '#edf8a3', '#f2faab', '#f7fcb3', '#fcfebb', '#fffcba', '#fff6af', '#feefa4', '#fee99a', '#fee38f', '#feda86', '#fed07d', '#fdc575', '#fdbb6c', '#fdb164', '#fca55d', '#fa9757', '#f88a50', '#f67d4a', '#f47044', '#ef6545', '#e95c47', '#e2524a', '#dc494c', '#d63f4f', '#cb334d', '#c0264a', '#b41a47', '#a90d45', '#9e0142'])
            .mode('lch')
            .colors(20);
        setRgbColors(colors.map((c) => chroma(c).rgb()));
    }, []);

    const colorRemapLayer = useMemo(() => {
        return new ColorRemapBitmapLayer({
            id: `BitmapLayer with color remapping#${Math.random()}`,
            _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
            image:
                'https://imgtr.ee/images/2023/09/10/503c5f5d028aa6ffb53682fd21f20ce0.png',
            bounds: [-180.0, -90, 180.0, 90],
            colormapData: rgbColors,
            colorRange: [
                0.0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6,
                0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95,
            ],
            pickable: true,
            onClick: ({bitmap, layer, coordinate, x, y, size, uv}) => {
                if (bitmap) {
                    const pixelColor = readPixelsToArray(layer.props.image, {
                        sourceX: bitmap.pixel[0],
                        sourceY: bitmap.pixel[1],
                        sourceWidth: 1,
                        sourceHeight: 1,
                    });
                    console.log('Color at picked pixel:', pixelColor);
                    console.log('Coordinates of picked pixel:', coordinate);
                    console.log('Clicked layer:', layer);
                    console.log('Click position in local x, y:', {x, y});
                }
            },
        });
    }, [rgbColors]);


    const handleZoomIn = () => {
        setViewport((prevViewport) => ({
            ...prevViewport,
            zoom: prevViewport.zoom * 1.2,
        }));
    };

    const handleZoomOut = () => {
        setViewport((prevViewport) => ({
            ...prevViewport,
            zoom: prevViewport.zoom / 1.2,
        }));
    };

    return (
        <div>
            <DeckGL
                layers={[colorRemapLayer]}
                initialViewState={isGlobeView ? initialGlobeViewState : initialMapViewState}
                controller={true}
            >
                {isGlobeView ? (
                    <GlobeView id="globe" repeat={true} resolution={5} />
                ) : (
                    <MapView id="map" repeat={true}>
                        <Map
                            mapStyle="https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json"
                        />
                    </MapView>
                )}
            </DeckGL>

            <div className="absolute top-2 right-2">
                <button className="rounded-full" onClick={handleZoomIn}>
                    Zoom In
                </button>
                <button className="rounded-full" onClick={handleZoomOut}>
                    Zoom Out
                </button>
                <button className="rounded-full" onClick={handleToggleViewMode}>
                    Toggle View Mode
                </button>
            </div>
        </div>
    );
};

export default MainMapDemo;
