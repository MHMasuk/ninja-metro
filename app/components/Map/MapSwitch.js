"use client";

import React, {useState, useMemo, useEffect, useRef} from 'react';

import DeckGL from '@deck.gl/react';
import {
    COORDINATE_SYSTEM,
    _GlobeView as GlobeView,
    MapView,
    LightingEffect,
    AmbientLight,
    _SunLight as SunLight
} from '@deck.gl/core';
import {MVTLayer} from '@deck.gl/geo-layers';
import {ParticleLayer} from 'deck.gl-particle';
import {readPixelsToArray} from '@luma.gl/core';

import Map, {Marker, NavigationControl, ScaleControl, Popup} from 'react-map-gl/maplibre';
import chroma from 'chroma-js';
import {scaleLinear} from "d3-scale";
import * as d3 from 'd3';

// components
import ColorRemapBitmapLayer from '@/app/components/CustomLayers/ColorRemapBitmapLayer';
import {DrawerDefault} from "@/app/components/DrawerDefault";

// materiral tailwind
import {
    Button,
    IconButton,
    List,
    ListItem,
    Input,
    Tooltip,
    Typography,
    Popover,
    PopoverHandler, PopoverContent
} from "@material-tailwind/react";

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
import TimeProgressScale from "@/app/components/Scale/TimeProgressScale";
import DateSlider from "@/app/components/Scale/DateSlider";
import {BottomDrawer} from "@/app/components/Drawer/BottomDrawer";
import GradientBar from "@/app/components/GradientBar";


// const ambientLight = new AmbientLight({
//     color: [255, 255, 255],
//     intensity: 0.5
// });
// const sunLight = new SunLight({
//     color: [255, 255, 255],
//     intensity: 2.0,
//     timestamp: 0
// });
// // create lighting effect with light sources
// const lightingEffect = new LightingEffect({ambientLight, sunLight});
import {PointLight, DirectionalLight} from '@deck.gl/core';

// create ambient light source
const ambientLight = new AmbientLight({
    color: [255, 255, 255],
    intensity: 1.0
});
// create point light source
const pointLight = new PointLight({
    color: [255, 255, 255],
    intensity: 2.0,
    // use coordinate system as the same as view state
    position: [-125, 50.5, 5000]
});
// create directional light source
const directionalLight = new DirectionalLight({
    color: [255, 255, 255],
    intensity: 1.0,
    direction: [-3, -9, -1]
});
// create lighting effect with light sources
const lightingEffect = new LightingEffect({ambientLight, pointLight, directionalLight});

const MapSwitch = () => {
    const [rgbColors, setRgbColors] = useState([]);
    const [rgbColorsNew, setRgbColorsNew] = useState([]);
    const [isGlobeView, setIsGlobeView] = useState(false);
    const [selectedLayers, setSelectedLayers] = useState(['ColorRemap']);
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

    const [openBottomDrawer, setOpenBottomDrawer] = React.useState(false);

    const openBottomDrawerHandle = () => setOpenBottomDrawer(true);
    const closeBottomDrawerHandle = () => setOpenBottomDrawer(false);

    // // d3 scale
    // // Create an array of date objects (e.g., one week)
    const startDate = new Date(); // Today's date
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // One week from today
    // const dateArray = d3.timeDay.range(startDate, endDate);
    //
    // const width = 500; // Adjust the width as needed
    // const height = 75; // Adjust the height as needed
    //
    // // Use a useRef to keep a reference to the scale container
    // const scaleContainerRef = useRef(null);
    //
    // useEffect(() => {
    //     // Remove any existing scales
    //     d3.select(scaleContainerRef.current).selectAll('svg').remove();
    //
    //     // Append SVG to the scale container
    //     const svg = d3.select(scaleContainerRef.current)
    //         .append("svg")
    //         .attr("width", width)
    //         .attr("height", height);
    //
    //     // Create scale
    //     const xScale = d3.scaleTime()
    //         .domain(d3.extent(dateArray))
    //         .range([0, width - 10]);
    //
    //     // Add scales to axis
    //     const x_axis = d3.axisBottom()
    //         .scale(xScale)
    //         .tickFormat((date, i) => {
    //             const dayFormat = d3.timeFormat('%a');
    //             const dateFormat = d3.timeFormat('%d');
    //             if (i === 0 || i === dateArray.length - 1) {
    //                 // Add spaces before and after the first and last labels
    //                 return `  ${dayFormat(date)} ${dateFormat(date)}  `;
    //             } else {
    //                 return `${dayFormat(date)} ${dateFormat(date)}`;
    //             }
    //         });
    //
    //     // Append group and insert axis
    //     const axisGroup = svg.append("g")
    //         .call(x_axis);
    //
    //     // Apply CSS styles to make line and text bold
    //     axisGroup.selectAll("line")
    //         .style("stroke-width", "2"); // Make line bold
    //
    //     axisGroup.selectAll("text")
    //         .style("font-weight", "bold"); // Make text bold
    // }, [dateArray]);


    const [selectedDate, setSelectedDate] = useState(startDate);

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
        // You can perform any additional actions here when the date changes
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

        // new
        const colorsNew = chroma
            .scale(['#fff', '#ddd'])
            .mode('lch')
            .colors(20);
        setRgbColorsNew(colorsNew.map((c) => chroma(c).rgb()));

        setSelectedLayers(['ColorRemap']);
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
                        return `<div
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                transform: translate(90px, 23px),
                                width: '24px',
                                height: '24px',
                                backgroundColor: 'red',
                                borderRadius: '50%',
                            }}
                        >
                            <h1>Hello</h1>
                        </div>`

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

    // const handleLayerToggle = (layerName) => {
    //     // Clear the selectedLayers array
    //     setSelectedLayers([]);
    //
    //     // Add the clicked layer to the selectedLayers array
    //     setSelectedLayers([layerName]);
    // };


    const handleLayerToggle = (layerName) => {
        setSelectedLayers((prevSelectedLayers) => {
            if (prevSelectedLayers.includes('windLayer')) {
                // If the "WindLayer" is already selected, keep it selected and add the new layer
                if (prevSelectedLayers.includes(layerName)) {
                    // If the new layer is already selected, do nothing
                    // return prevSelectedLayers;
                    return [layerName, 'windLayer']
                } else {
                    // If the new layer is not selected, add it to the existing selection
                    return [layerName, 'windLayer'];
                }
            } else {
                // If the "WindLayer" is not in the selection, handle the selection normally (replace current selections)
                return [layerName];
            }
        });
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


    // const getTooltip = ({object}) => {
    //     if (!object) {
    //         return null;
    //     }
    //     const lat = object.position[1];
    //     const lng = object.position[0];
    //
    //     return `\
    //         latitude: ${Number.isFinite(lat) ? lat.toFixed(6) : ''}
    //         longitude: ${Number.isFinite(lng) ? lng.toFixed(6) : ''}`;
    // }

    const legendStyle = {
        "background": 'linear-gradient(to right, rgb(98, 113, 184), rgb(98, 113, 184), rgb(98, 113, 184), rgb(98, 113, 184), rgb(61, 110, 163), rgb(74, 148, 170), rgb(74, 146, 148), rgb(77, 142, 124), rgb(76, 164, 76), rgb(103, 164, 54), rgb(162, 135, 64), rgb(162, 109, 92), rgb(141, 63, 92), rgb(151, 75, 145), rgb(95, 100, 160), rgb(91, 136, 161), rgb(91, 136, 161))',
        "width": '100%',
        "background-color": '#7c7c7c',
        "white-space": 'nowrap',
        "font-size": '12px',
        "box-shadow": '0 0 4px 0 black'
    }

    const gradientStops = [
        { color: 'blue', percentage: 0 },
        { color: 'green', percentage: 20 },
        { color: 'yellow', percentage: 40 },
        { color: 'red', percentage: 60 },
        { color: 'blue', percentage: 80 },
        { color: 'blue', percentage: 100 }
    ];

    return (
        <div>
            <DeckGL
                layers={layers}
                initialViewState={isGlobeView ? viewport : initialMapViewState}
                controller={true}
                effects={lightingEffect}
            >
                {isGlobeView ? (
                    <GlobeView id="globe" repeat={true} resolution={5} views={'globe'} />

                ) : (
                    <MapView id="map" repeat={true}>
                        <Map
                            mapStyle="https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json"
                        />
                    </MapView>
                )}

            </DeckGL>

            {/*<div className="absolute">*/}
            {/*    <Marker longitude={90} latitude={23} anchor="bottom" className="z-50">*/}
            {/*        <PlusIcon className="h-16 w-16"/>*/}
            {/*    </Marker>*/}
            {/*</div>*/}

            {/* Main search bar */}
            <div className="absolute flex items-center ml-4">
               <Typography variant="h3"> Logo </Typography>
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
            </div>

            {/* Right side menu start */}
            <div className="absolute top-2 right-2 text-center">
                {isGlobeView ? (
                    <div className="mb-1">
                        <div className="mb-1">
                            <Tooltip content="Zoom In" placement="left-end">
                                <IconButton className="rounded-full" size="sm" onClick={handleZoomIn}>
                                    <PlusIcon className="h-4 w-4"/>
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div>
                            <Tooltip content="Zoom Out" placement="left-end">
                                <IconButton className="rounded-full" size="sm" onClick={handleZoomOut}>
                                    <MinusIcon className="h-4 w-4"/>
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
                                    <MinusIcon className="h-4 w-4"/>
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
                                    <MapIcon className="h-4 w-4"/>
                                </Button>
                            </Tooltip>
                        </div>

                    ) : (
                        <div className="mb-1">
                            <Tooltip content="3D Mode" placement="left-end">
                                <IconButton className="rounded-full" size="sm" onClick={handleToggleViewMode}>
                                    <GlobeAltIcon className="h-4 w-4"/>
                                </IconButton>

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
                                <FireIcon className="h-4 w-4"/>
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
                                <MapPinIcon className="h-4 w-4"/>
                            </IconButton>
                        </Tooltip>
                    </div>

                </div>
                {/* Main layer menu section End */}

                {/* Drawer start */}
                <div className="mt-1">
                    <DrawerDefault handleLayerToggle={handleLayerToggle}/>
                </div>
                {/* Drawer End */}

                {/* Bottom drawer start */}
                <div className="mt-1">
                    <BottomDrawer
                        handleLayerToggle={handleLayerToggle}
                        openBottomDrawerHandle={openBottomDrawerHandle}
                        closeBottomDrawerHandle={closeBottomDrawerHandle}
                        openBottomDrawer={openBottomDrawer}
                    />
                </div>
                {/* Bottom drawer End */}
            </div>
            {/* Right side menu END */}


            {/* Bottom left icon */}
            <div className="absolute bottom-10 left-14 w-1/2">
                <div className="">
                    <div style={{height: 8, width: '100%', display: 'flex', flexDirection: 'row'}}>
                        <div style={{flex: '0 0 14.28%', background: 'rgb(254, 246, 181)'}}/>
                        <div style={{flex: '0 0 14.28%', background: 'rgb(255, 221, 154)'}}/>
                        <div style={{flex: '0 0 14.28%', background: 'rgb(255, 194, 133)'}}/>
                        <div style={{flex: '0 0 14.28%', background: 'rgb(255, 166, 121)'}}/>
                        <div style={{flex: '0 0 14.28%', background: 'rgb(250, 138, 118)'}}/>
                        <div style={{flex: '0 0 14.28%', background: 'rgb(241, 109, 122)'}}/>
                        <div style={{flex: '0 0 14.28%', background: 'rgb(225, 83, 131)'}}/>
                    </div>
                    <div style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                        <div style={{width: '14.28%'}}>0</div>
                        <div style={{width: '14.28%'}}>25</div>
                        <div style={{width: '14.28%'}}>50</div>
                        <div style={{width: '14.28%'}}>100</div>
                        <div style={{width: '14.28%'}}>300</div>
                        <div style={{width: '14.28%'}}>500</div>
                        <div style={{width: '14.28%'}}>1000</div>
                    </div>
                </div>
            </div>

            {/* Bottom right icon */}
            {/* This all are common layer */}
            <div className="absolute bottom-10 right-5 text-right">
                <div className="mb-5">
                    <Tooltip content="Particles" placement="left-end">
                        <IconButton
                            className={`rounded-full ${
                                isLayerSelected('windLayer')
                                && 'bg-blue-500'
                            }`}
                            size="sm"
                            onClick={() => handleLayerToggleNew('windLayer')}
                        >
                            <ArrowTrendingUpIcon className="h-4 w-4"/>
                        </IconButton>
                    </Tooltip>
                </div>

                {/*<div className="w-72">*/}
                {/*    <div style={{height: 8, width: '100%', display: 'flex', flexDirection: 'row'}}>*/}
                {/*        <div style={{flex: '0 0 14.28%', background: 'rgb(254, 246, 181)'}}/>*/}
                {/*        <div style={{flex: '0 0 14.28%', background: 'rgb(255, 221, 154)'}}/>*/}
                {/*        <div style={{flex: '0 0 14.28%', background: 'rgb(255, 194, 133)'}}/>*/}
                {/*        <div style={{flex: '0 0 14.28%', background: 'rgb(255, 166, 121)'}}/>*/}
                {/*        <div style={{flex: '0 0 14.28%', background: 'rgb(250, 138, 118)'}}/>*/}
                {/*        <div style={{flex: '0 0 14.28%', background: 'rgb(241, 109, 122)'}}/>*/}
                {/*        <div style={{flex: '0 0 14.28%', background: 'rgb(225, 83, 131)'}}/>*/}
                {/*    </div>*/}
                {/*    <div style={{width: '100%', display: 'flex', flexDirection: 'row'}}>*/}
                {/*        <div style={{width: '14.28%'}}>0</div>*/}
                {/*        <div style={{width: '14.28%'}}>20</div>*/}
                {/*        <div style={{width: '14.28%'}}>40</div>*/}
                {/*        <div style={{width: '14.28%'}}>60</div>*/}
                {/*        <div style={{width: '14.28%'}}>80</div>*/}
                {/*        <div style={{width: '14.28%'}}>100</div>*/}
                {/*        <div style={{width: '14.28%'}}>130</div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div className="w-72 rounded-full">
                    <GradientBar stops={gradientStops} />
                </div>

            </div>
        </div>
    );
};

export default MapSwitch;
