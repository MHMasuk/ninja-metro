"use client";

import React, {useState, useMemo} from 'react';

import DeckGL from '@deck.gl/react';
import {COORDINATE_SYSTEM, _GlobeView as GlobeView, MapView} from '@deck.gl/core';
import {MVTLayer} from '@deck.gl/geo-layers';
import {ParticleLayer} from 'deck.gl-particle';
import {readPixelsToArray} from '@luma.gl/core';

import Map from 'react-map-gl/maplibre';
import chroma from 'chroma-js';

// components
import ColorRemapBitmapLayer from '@/app/components/CustomLayers/ColorRemapBitmapLayer';
import {DrawerDefault} from "@/app/components/DrawerDefault";


// materiral tailwind
import {Button, IconButton, List, ListItem, Input, Tooltip} from "@material-tailwind/react";

// heroicons
import {
    PlusIcon,
    MinusIcon,
    MapIcon,
    GlobeAltIcon,
    ArrowTrendingUpIcon,
    FireIcon,
    MapPinIcon
} from "@heroicons/react/24/solid";
import {MagnifyingGlassIcon} from "@heroicons/react/20/solid";
import WindLayerCustom from "@/app/components/CustomLayers/WindLayerCustom";

const MapSwitch = () => {
    const [rgbColors, setRgbColors] = useState([]);
    const [rgbColorsNew, setRgbColorsNew] = useState([]);
    const [isGlobeView, setIsGlobeView] = useState(false);
    const [selectedLayers, setSelectedLayers] = useState([]);
    const [settings, setSettings] = useState({
        time: 30,
        showColorRemap: true,
        showWindLayer: true,
        showMvtLayer: true,
        useDevicePixels: true,
    });
    const [viewport, setViewport] = useState({
        width: 500,
        height: 500,
        longitude: 90.3563, // Set the initial longitude for the globe view
        latitude: 23.6850,  // Set the initial latitude for the globe view
        zoom: 2,      // Set the initial zoom level for the globe view
        maxZoom: 16,
    });

    const [initialMapViewState, setInitialMapViewState] = useState({
        width: 500,
        height: 500,
        longitude: 90.3563, // Set the initial longitude for the map view
        latitude: 23.6850,  // Set the initial latitude for the map view
        zoom: 4,            // Set the initial zoom level for the map view
        maxZoom: 16,
    });

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

        // new
        const colorsNew = chroma
            .scale(['#fff', '#ddd'])
            .mode('lch')
            .colors(20);
        setRgbColorsNew(colorsNew.map((c) => chroma(c).rgb()));
    }, []);

    const temparatureLayer = useMemo(() => {
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


    const windLayer = useMemo(() => {
        return new WindLayerCustom({
            id: `WindLayer with color remapping#${Math.random()}`,
            _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
            image:
                'https://imgtr.ee/images/2023/09/10/503c5f5d028aa6ffb53682fd21f20ce0.png',
            bounds: [-180.0, -90, 180.0, 90],
            colormapData: rgbColorsNew,
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
    }, [rgbColorsNew]);

    const layers = useMemo(() => {
        return [
            selectedLayers.includes('ColorRemap') &&
            settings.showColorRemap &&
            new ColorRemapBitmapLayer({
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
                highlightRed: false,
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
                        return {
                            html: `<div><b>Coordinates:</b> ${x}</div>`,
                            style: {
                                backgroundColor: 'darkgray',
                                color: 'white',
                            },
                        }
                    }
                },
            }),
            selectedLayers.includes('mvtLayer') &&
            settings.showMvtLayer &&
            new MVTLayer({
                data: 'http://127.0.0.1:7788/tile/m10a0ne.json/{z}/{x}/{y}',
                minZoom: 0,
                maxZoom: 23,
                getLineColor: [128, 128, 128, 255],
                getFillColor: [140, 170, 180, 0],
                binary: true,
                getLineWidth: (f) => {
                    switch (f.properties.class) {
                        case 'street':
                            return 6;
                        case 'motorway':
                            return 10;
                        default:
                            return 1;
                    }
                },
                lineWidthMinPixels: 1,
            }),
            selectedLayers.includes('windLayer') &&
            settings.showWindLayer &&
            new ParticleLayer({
                id: 'particle1',
                image:
                    'https://mapbox.github.io/webgl-wind/demo/wind/2016112000.png',
                imageUnscale: [-128, 127],
                bounds: [-180, -90, 180, 90],
                numParticles: 2500,
                maxAge: 50,
                speedFactor: 2,
                color: [255, 255, 255, 235, 255, 235],
                width: 1.5,
                opacity: 0.5,
                // textureParameters: {
                //     [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
                // },
                animate: true,
            })
        ].filter(Boolean);
    }, [selectedLayers]);


    const handleLayerToggleNew = (layerName) => {
        // Check if the layer is already in the selectedLayers array
        if (selectedLayers.includes(layerName)) {
            // If it is, remove it
            setSelectedLayers(selectedLayers.filter((name) => name !== layerName));
        } else {
            // If it isn't, add it
            setSelectedLayers([...selectedLayers, layerName]);
        }
    };

    const handleLayerToggle = (layerName) => {
        // Clear the selectedLayers array
        setSelectedLayers([]);

        // Add the clicked layer to the selectedLayers array
        setSelectedLayers([layerName]);
    };

    const isLayerSelected = (layerName) => selectedLayers.includes(layerName);


    // Zoom in, out switch
    const handleZoomIn = () => {
        setViewport((prevViewport) => ({
            ...prevViewport,
            zoom: prevViewport.zoom * 1.2,
        }));
    };

    const handleMapViewZoomIn = () => {
        setInitialMapViewState((prevInitialMapViewState) => ({
            ...prevInitialMapViewState,
            zoom: prevInitialMapViewState.zoom * 1.2,
        }))
    };

    const handleZoomOut = () => {
        setViewport((prevViewport) => ({
            ...prevViewport,
            zoom: prevViewport.zoom / 1.2,
        }));
    };


    const handleMapViewZoomOut = () => {
        setInitialMapViewState((prevInitialMapViewState) => ({
            ...prevInitialMapViewState,
            zoom: prevInitialMapViewState.zoom / 1.2,
        }))
    };

    return (
        <div>
            <DeckGL
                layers={layers}
                initialViewState={isGlobeView ? viewport : initialMapViewState}
                controller={true}
                // onViewStateChange={(newViewport) => setViewport(newViewport)}
            >
                {isGlobeView ? (
                    <GlobeView id="globe" repeat={true} resolution={5}/>
                ) : (
                    <MapView id="map" repeat={true}>
                        <Map
                            mapStyle="https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json"
                        />
                    </MapView>
                )}
            </DeckGL>

            {/* Main search bar */}
            <div className="p-2 w-72">
                {/*<Input icon={<MagnifyingGlassIcon className="h-5 w-5 text-black" />} label="Search" color="black" className="border-white bg-white" />*/}
                <Input
                    type="email"
                    placeholder="Search Location"
                    className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                    labelProps={{
                        className: "hidden",
                    }}
                    containerProps={{className: "min-w-[100px]"}}
                    icon={<MagnifyingGlassIcon className="h-5 w-5 text-black"/>}
                />
            </div>


            {/* Right side menu start */}
            <div className="absolute top-2 right-2 text-center">
                {isGlobeView ? (
                    <div className="mb-1">
                        <div className="mb-1">
                            <Tooltip content="Zoom In" placement="left-end">
                                <IconButton className="rounded-full" size="sm" onClick={handleZoomIn}>
                                    <PlusIcon className="h-5 w-5"/>
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div>
                            <Tooltip content="Zoom Out" placement="left-end">
                                <IconButton className="rounded-full" size="sm" onClick={handleZoomOut}>
                                    <MinusIcon className="h-5 w-5"/>
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                ) : (
                    <div className="mb-1">
                        <div className="mb-1">
                            <Tooltip content="Zoom In" placement="left-end">
                                <IconButton className="rounded-full" size="sm" onClick={handleMapViewZoomIn}>
                                    <PlusIcon className="h-5 w-5"/>
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div>
                            <Tooltip content="Zoom Out" placement="left-end">
                                <IconButton className="rounded-full" size="sm" onClick={handleMapViewZoomOut}>
                                    <MinusIcon className="h-5 w-5"/>
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                )}

                <div className="mb-1">
                    {isGlobeView ? (
                        <div className="mb-1">
                            <Tooltip content="2D Mode" placement="left-end">
                                <Button className="rounded-full" size="sm" onClick={handleToggleViewMode}>
                                    <MapIcon className="h-5 w-5"/>
                                </Button>
                            </Tooltip>
                        </div>

                    ) : (
                        <div className="mb-1">
                            <Tooltip content="3D Mode" placement="left-end">
                                <Button className="rounded-full" size="sm" onClick={handleToggleViewMode}>
                                    <GlobeAltIcon className="h-5 w-5"/>
                                </Button>

                            </Tooltip>
                        </div>
                    )}
                </div>

                {/* Main layer menu section start */}

                <div className="rounded-2xl bg-white p-1 mb-1">
                    <div className="mb-1">
                        <Tooltip content="Temparature" placement="left-end">
                            <IconButton
                                className={`rounded-full ${
                                    isLayerSelected('ColorRemap')
                                    && 'bg-blue-500'
                                }`}
                                size="sm"
                                onClick={() => handleLayerToggle('ColorRemap')}
                            >
                                <FireIcon className="h-5 w-5"/>
                            </IconButton>
                        </Tooltip>
                    </div>

                    <div className="mb-1">
                        <Tooltip content="MVTLayer" placement="left-end">
                            <IconButton
                                className={`rounded-full ${
                                    isLayerSelected('mvtLayer')
                                    && 'bg-blue-500'
                                }`}
                                size="sm"
                                onClick={() => handleLayerToggle('mvtLayer')}
                            >
                                <MapPinIcon className="h-5 w-5"/>
                            </IconButton>
                        </Tooltip>
                    </div>

                </div>

                {/*<h1>This is Common layer</h1>*/}

                <div className="mb-1">
                    <Tooltip content="Particles" placement="left-end">
                        <IconButton
                            className={`rounded-full ${
                                isLayerSelected('windLayer')
                                && 'bg-blue-500'
                            }`}
                            size="sm"
                            onClick={() => handleLayerToggleNew('windLayer')}
                        >
                            <ArrowTrendingUpIcon className="h-5 w-5"/>
                        </IconButton>
                    </Tooltip>
                </div>


                {/* Main layer menu section End */}

                {/* Drawer start */}
                <div className="mt-1">
                    <DrawerDefault/>
                </div>
                {/* Drawer End */}

            </div>
            {/* Right side menu END */}
        </div>
    );
};

export default MapSwitch;
