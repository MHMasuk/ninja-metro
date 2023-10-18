// "use client"
//
// import React, {useState, useMemo} from 'react';
// // import 'mapbox-gl/dist/mapbox-gl.css';
// import 'maplibre-gl/dist/maplibre-gl.css';
// import Map, {
//     NavigationControl,
//     Popup,
//     AttributionControl,
//     FullscreenControl,
//     GeolocateControl,
//     ScaleControl
// } from 'react-map-gl/maplibre';
// import {
//     COORDINATE_SYSTEM,
//     _GlobeView as GlobeView,
// } from '@deck.gl/core';
// import DeckGL from '@deck.gl/react/typed';
// import {DeckProps, PickingInfo} from '@deck.gl/core/typed';
// import {ArcLayer, BitmapLayer} from '@deck.gl/layers/typed';
// import {ParticleLayer} from 'deck.gl-particle';
// import ColorRemapBitmapLayer from '../../components/CustomLayers/ColorRemapBitmapLayer';
// import {useControl, Marker} from 'react-map-gl/maplibre';
// import {MapboxOverlay} from '@deck.gl/mapbox/typed';
//
// import chroma from 'chroma-js';
//
// import {readPixelsToArray} from '@luma.gl/core';
// import {mat3} from "gl-matrix";
// // import projection = module
//
// const TOKEN = 'pk.eyJ1IjoibWhtYXN1ayIsImEiOiJjbGljNXRpa24wa2c3M3JtdWJwM29zZDBzIn0.CsBqBqsiW7GvHMCz6YIxJg'; // Set your mapbox token here
//
// const initialViewState = {
//     // longitude: -122.4,
//     // latitude: 37.74,
//     longitude: -100,
//     latitude: 40,
//     zoom: 4,
//     // projection: "globe"
// };
//
//
// const MapFormatCode = () => {
//     const [showMarker, setShowMarker] = useState(false)
//     const [markerCoordinates, setMarkerCoordinates] = useState(null)
//     const [rgbColors, setRgbColors] = useState([])
//     const [selectedLayer, setSelectedLayer] = useState("arc"); // Default to ArcLayer
//     const [windLayerSelected, setWindLayerSelected] = useState(false);
//
//     useMemo(() => {
//         // Initialize colors
//         const colors = chroma
//             .scale(['#5e4fa2', '#555ba8', '#4c66ad', '#4372b3', '#3a7eb8', '#3389bd', '#3e95b8', '#48a1b3', '#53adae', '#5eb9a9', '#69c3a5', '#77c9a5', '#85cea5', '#93d4a4', '#a1d9a4', '#afdea3', '#bbe3a1', '#c7e89e', '#d3ed9c', '#dff299', '#e8f69b', '#edf8a3', '#f2faab', '#f7fcb3', '#fcfebb', '#fffcba', '#fff6af', '#feefa4', '#fee99a', '#fee38f', '#feda86', '#fed07d', '#fdc575', '#fdbb6c', '#fdb164', '#fca55d', '#fa9757', '#f88a50', '#f67d4a', '#f47044', '#ef6545', '#e95c47', '#e2524a', '#dc494c', '#d63f4f', '#cb334d', '#c0264a', '#b41a47', '#a90d45', '#9e0142'])
//             .mode('lch')
//             .colors(20);
//
//         setRgbColors(colors.map((c) => chroma(c).rgb()));
//
//     }, []);
//
//
//     const handleMarkerAddClick = (e) => {
//         console.log(e)
//         setMarkerCoordinates({
//             lat: e?.lngLat?.lat,
//             lng: e?.lngLat?.lng,
//         });
//     };
//
//     const layers = [
//         {
//             id: "arc",
//             label: "Arc Layer",
//             config: new ArcLayer({
//                 data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-segments.json',
//                 getSourcePosition: d => d.from.coordinates,
//                 getTargetPosition: d => d.to.coordinates,
//                 getSourceColor: [255, 200, 0],
//                 getTargetColor: [0, 140, 255],
//                 getWidth: 12,
//                 pickable: true,
//                 autoHighlight: true
//             }),
//         },
//         {
//             id: "bitmap",
//             label: "Bitmap Layer",
//             config: new BitmapLayer({
//                 id: 'bitmap-layer',
//                 bounds: [-122.5190, 37.7045, -122.355, 37.829],
//                 image: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-districts.png',
//                 pickable: true,
//                 onClick: ({bitmap, layer}) => {
//                     if (bitmap) {
//                         const pixelColor = readPixelsToArray(layer.props.image, {
//                             sourceX: bitmap.pixel[0],
//                             sourceY: bitmap.pixel[1],
//                             sourceWidth: 1,
//                             sourceHeight: 1
//                         });
//                         console.log('Color at picked pixel:', pixelColor);
//                     }
//                 }
//             }),
//         },
//         {
//             id: "wind",
//             label: "Wind Layer",
//             config: new ParticleLayer({
//                 id: 'particle1',
//                 image:
//                     'https://mapbox.github.io/webgl-wind/demo/wind/2016112000.png',
//                 imageUnscale: [-128, 127],
//                 bounds: [-180, -90, 180, 90],
//                 numParticles: 2500,
//                 maxAge: 50,
//                 speedFactor: 2,
//                 color: [255, 255, 255, 235, 255, 235],
//                 width: 1.5,
//                 opacity: 0.5,
//                 // textureParameters: {
//                 //     [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
//                 // },
//                 animate: true,
//             }),
//         },
//         {
//             id: "colorMap",
//             label: "Color Map",
//             config: new ColorRemapBitmapLayer({
//                 id: `BitmapLayer with color remapping#${Math.random()}`,
//                 _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
//                 image: 'https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png',
//                 bounds: [-180.0, -90, 180.0, 90],
//                 colormapData: rgbColors,
//                 colorRange: [
//                     0.0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6,
//                     0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95,
//                 ],
//                 pickable: true,
//                 highlightRed: false,
//                 onClick: ({bitmap, layer, coordinate, x, y, size, uv}) => {
//                     if (bitmap) {
//                         const pixelColor = readPixelsToArray(layer.props.image, {
//                             sourceX: bitmap.pixel[0],
//                             sourceY: bitmap.pixel[1],
//                             sourceWidth: 1,
//                             sourceHeight: 1,
//                         });
//                         console.log('Color at picked pixel:', pixelColor);
//                         console.log('Coordinates of picked pixel:', coordinate);
//                         console.log('Clicked layer:', layer);
//                         console.log('Click position in local x, y:', {x, y});
//                     }
//                 },
//             }),
//         },
//
//     ];
//
//
//     const bitLayer = new ColorRemapBitmapLayer({
//         id: `BitmapLayer with color remapping#${Math.random()}`,
//         _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
//         image: 'https://imgtr.ee/images/2023/10/10/65c35a75a5c03becc2450fa419f21b92.png',
//         bounds: [-180.0, -90, 180.0, 90],
//         colormapData: rgbColors,
//         colorRange: [
//             0.0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6,
//             0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95,
//         ],
//         pickable: true,
//         highlightRed: false,
//         onClick: ({bitmap, layer, coordinate, x, y, size, uv}) => {
//             if (bitmap) {
//                 const pixelColor = readPixelsToArray(layer.props.image, {
//                     sourceX: bitmap.pixel[0],
//                     sourceY: bitmap.pixel[1],
//                     sourceWidth: 1,
//                     sourceHeight: 1,
//                 });
//                 console.log('Color at picked pixel:', pixelColor);
//                 console.log('Coordinates of picked pixel:', coordinate);
//                 console.log('Clicked layer:', layer);
//                 console.log('Click position in local x, y:', {x, y});
//             }
//         },
//     })
//
//     const [showPopup, setShowPopup] = useState(true);
//
//     console.log(markerCoordinates)
//     return (
//         <div className="relative min-h-screen">
//
//             <Map
//                 style={{width: "100vw", height: "100vh"}}
//                 initialViewState={initialViewState}
//                 mapStyle="https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json"
//                 // mapStyle="https://api.maptiler.com/maps/62ab0c0b-09b1-4c58-b0c4-2e82ca1cf5ed/style.json?key=YbCPLULzWdf1NplssEIc"
//                 // mapStyle="https://api.maptiler.com/maps/hybrid/style.json?key=YbCPLULzWdf1NplssEIc#0.8/-14.45028/20.54042"
//                 // mapStyle="https://api.maptiler.com/maps/streets/style.json?key=YbCPLULzWdf1NplssEIc"
//                 onClick={handleMarkerAddClick}
//                 mapboxAccessToken={TOKEN}
//                 projection="globe"
//             >
//                 {/*<GlobeView id="globe" repeat={true} resolution={5} views={'globe'}> </GlobeView>*/}
//
//
//                 {layers.map((layer, index) => (
//                     selectedLayer === layer.id && (
//                         <DeckGLOverlay layers={[layer.config]} key={index}/>
//                         // <DeckGL initialViewState={initialViewState} layers={[layer.config]} getTooltip={getTooltip} key={index}/>
//                     )
//                 ))}
//                 {windLayerSelected && (
//                     <DeckGLOverlay
//                         layers={[layers.find((layer) => layer.id === "wind").config]} />
//                     // <DeckGL layers={[layers.find((layer) => layer.id === "wind").config]} getTooltip={getTooltip} />
//                 )}
//
//                 <NavigationControl/>
//                 {showPopup && (
//                     <Popup
//                         longitude={-100}
//                         latitude={40}
//                         anchor="bottom"
//                         draggable={true}
//                         onClose={() => setShowPopup(false)}
//                     >
//                         You are here
//                     </Popup>
//                 )
//                 }
//
//                 <div style={{position: "absolute", top: 10, right: 10, zIndex: 10}}>
//                     {layers.map((layer) => (
//                         <button key={layer.id} onClick={() => setSelectedLayer(layer.id)}>
//                             {layer.label}
//                         </button>
//                     ))}
//                     <button
//                         onClick={() => setWindLayerSelected(!windLayerSelected)}
//                         className={`px-4 py-2 rounded focus:outline-none ${
//                             windLayerSelected
//                                 ? "bg-blue-500 text-white"
//                                 : "bg-gray-200 text-black"
//                         }`}
//                     >
//                         Show Wind Layer
//                     </button>
//
//                 </div>
//                 {/*<AttributionControl customAttribution="Map design by me"/>*/}
//                 <FullscreenControl/>
//                 <GeolocateControl
//                     style={{zIndex: 200}}
//                 />
//                 <ScaleControl/>
//                 {markerCoordinates ?
//                     <Marker
//                         longitude={markerCoordinates?.lng}
//                         latitude={markerCoordinates?.lat}
//                         anchor="center"
//                         color="red"
//                         draggable={true}
//                         onClick={() => console.log("marker click")}
//                         style={{zIndex: 99}}
//                         onDragEnd={(e) =>
//                             setMarkerCoordinates({lng: e.lngLat.lng, lat: e.lngLat.lat})
//                         }
//                     >
//                         Data
//                         <button className="bg-teal-200" style={{zIndex: 200}}>New button</button>
//                     </Marker>
//                     : null
//                 }
//
//             </Map>
//         </div>
//     );
// }
//
// export default MapFormatCode;