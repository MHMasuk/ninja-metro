"use client";

import * as React from 'react';
import {useState, useMemo, useEffect} from "react";

import 'maplibre-gl/dist/maplibre-gl.css';

// deck.gl import
import {MapView, COORDINATE_SYSTEM, _GlobeView as GlobeView} from '@deck.gl/core';
import DeckGL from '@deck.gl/react';
import {readPixelsToArray} from '@luma.gl/core';

// react map gl import
import Map from 'react-map-gl/maplibre';

// third part library
import chroma from 'chroma-js';

// layers
import ColorRemapBitmapLayer from "@/app/components/CustomLayers/ColorRemapBitmapLayer";

// materiral tailwind
import { IconButton } from "@material-tailwind/react";

// heroicons
import {
    PresentationChartBarIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    InboxIcon,
    PowerIcon,
    PlusIcon,
    MinusIcon,
    MapIcon,
    GlobeAltIcon
} from "@heroicons/react/24/solid";
import {DrawerDefault} from "@/app/components/DrawerDefault";

const MainMap = () => {
    const [rgbColors, setRgbColors] = useState([]);
    const [viewport, setViewport] = useState({
        // width: 500,
        // height: 500,
        longitude: 90.3563,
        latitude: 23.6850,
        zoom: 4,
        maxZoom: 16,
        // minZoom: 10,
        // pitch: 37.11535300402728,
        // bearing: -0.6424747174301046,
    });
    const [viewMode, setViewMode] = useState('globe');

    const handleZoomIn = () => {
        // Increase the zoom level by a factor (you can adjust the factor)
        setViewport((prevViewport) => ({
            ...prevViewport,
            zoom: prevViewport.zoom * 1.2,
        }));
    };

    const handleZoomOut = () => {
        // Decrease the zoom level by a factor (you can adjust the factor)
        setViewport((prevViewport) => ({
            ...prevViewport,
            zoom: prevViewport.zoom / 1.2,
        }));
    };


// useEffect(() => {
//     // Adjust the zoom level when switching between view modes
//     if (viewMode === 'globe') {
//         setViewport((prevViewport) => ({
//             ...prevViewport,
//             zoom: 4,
//         }));
//     } else {
//         setViewport((prevViewport) => ({
//             ...prevViewport,
//             zoom: 4,
//         }));
//     }
// }, [viewMode]);

useEffect(() => {
    // Adjust the view state when switching between view modes
    if (viewMode === 'globe') {
        setViewport((prevViewport) => ({
            ...prevViewport,
            longitude: 90.3563,
            latitude: 23.6850,
            zoom: 4,
        }));
    } else {
        setViewport((prevViewport) => ({
            ...prevViewport,
            longitude: 90.3563,
            latitude: 23.6850,
            zoom: 4
        }));
    }
}, [viewMode]);

    const toggleViewMode = () => {
        // Toggle between 'globe' and 'map' view modes
        setViewMode((prevMode) => (prevMode === 'globe' ? 'map' : 'globe'));
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

    return (
        <div>
            <DeckGL
                layers={[colorRemapLayer]}
                initialViewState={viewport}
                controller={true}
            >
                {viewMode === 'globe' ? (
                    <GlobeView id="map" repeat={true} resolution={5}></GlobeView>
                ) : (
                    <MapView id="map" repeat={true}>
                        <Map
                            mapStyle="https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json"
                        >
                        </Map>
                    </MapView>
                )}

                {/*<MapView id="map" repeat={true}>*/}
                {/*    <Map*/}
                {/*        mapStyle="https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json"*/}
                {/*    >*/}
                {/*    </Map>*/}
                {/*</MapView>*/}

                {/*<GlobeView id="map" repeat={true} resolution={5}></GlobeView>*/}

                <div className="absolute top-2 right-2">
                    <IconButton className="rounded-full" size="sm" onClick={handleZoomIn}>
                        <PlusIcon className="h-5 w-5" />
                    </IconButton>

                    <IconButton className="rounded-full" size="sm" onClick={handleZoomOut}>
                        <MinusIcon className="h-5 w-5" />
                    </IconButton>

                    <IconButton
                        className="absolute top-2 right-2 z-10"
                        size="sm"
                        onClick={toggleViewMode}
                    >
                        <MapIcon className="h-6 w-6" />
                    </IconButton>

                    <DrawerDefault />
                </div>

            </DeckGL>
        </div>
    )
}

export default MainMap;