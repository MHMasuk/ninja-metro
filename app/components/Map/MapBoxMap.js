"use client"

// import React, { useState } from 'react';
// import DeckGL from '@deck.gl/react';
// import { ScatterplotLayer } from '@deck.gl/layers';
// import Map from 'react-map-gl';
// import { Marker } from 'react-map-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
//
// const MAPBOX_ACCESS_TOKEN =
//     "pk.eyJ1IjoibWhtYXN1ayIsImEiOiJjbGljNXRpa24wa2c3M3JtdWJwM29zZDBzIn0.CsBqBqsiW7GvHMCz6YIxJg";
//
// const initialViewState = {
//     longitude: -73.9,
//     latitude: 40.73,
//     zoom: 9
// };
// const MapBoxMap = () => {
//     const [marker, setMarker] = useState(null);
//
//     const layers = [
//         new ScatterplotLayer({
//             id: 'scatterplot-layer',
//             data: [], // your data here
//             // other layer props
//         }),
//     ];
//
//     const onClick = (info) => {
//         if (info.object) {
//             setMarker({
//                 longitude: info.coordinate[0],
//                 latitude: info.coordinate[1],
//             });
//         }
//     };
//
//     return (
//         <DeckGL
//             initialViewState={initialViewState}
//             controller={true}
//             layers={layers}
//             onClick={onClick}
//         >
//             <Map
//                 mapboxApiAccessToken="pk.eyJ1IjoibWhtYXN1ayIsImEiOiJjbGljNXRpa24wa2c3M3JtdWJwM29zZDBzIn0.CsBqBqsiW7GvHMCz6YIxJg"
//                 mapStyle="mapbox://styles/mapbox/streets-v9"
//             >
//                 {marker && (
//                     <Marker longitude={marker.longitude} latitude={marker.latitude}>
//                         <div>You clicked here!</div>
//                     </Marker>
//                 )}
//             </Map>
//         </DeckGL>
//     );
// }
//
// export default MapBoxMap;


// import * as React from 'react';
// import Map from 'react-map-gl';
//
// const MapBoxMap = () => {
//     return (
//         <Map
//             mapboxAccessToken="pk.eyJ1IjoibWhtYXN1ayIsImEiOiJjbGljNXRpa24wa2c3M3JtdWJwM29zZDBzIn0.CsBqBqsiW7GvHMCz6YIxJg"
//             initialViewState={{
//                 longitude: -122.4,
//                 latitude: 37.8,
//                 zoom: 14
//             }}
//             style={{width: 600, height: 400}}
//             mapStyle="mapbox://styles/mapbox/streets-v9"
//         />
//     );
// }
//
// export default MapBoxMap


// import React from 'react';
// import Map from 'react-map-gl/maplibre';
// import DeckGL from '@deck.gl/react';
// import { ScatterplotLayer } from '@deck.gl/layers';
//
// // Initial viewport settings
// const initialViewState = {
//     longitude: -122.41669,
//     latitude: 37.7853,
//     zoom: 13,
//     pitch: 0,
//     bearing: 0
// };
//
// // Data to be used by the layer
// const data = [
//     { position: [-122.41669, 37.7853], color: [255, 0, 0], radius: 100 },
//     { position: [-121.41669, 36.7853], color: [255, 255, 0], radius: 50 }
// ];
//
// // DeckGL react component
// const MapBoxMap = () => {
//     const layers = [
//         new ScatterplotLayer({
//             id: 'scatterplot-layer',
//             data,
//             pickable: true,
//             opacity: 0.8,
//             stroked: true,
//             filled: true,
//             radiusScale: 6,
//             radiusMinPixels: 1,
//             radiusMaxPixels: 100,
//             lineWidthMinPixels: 1,
//             getPosition: d => d.position,
//             getRadius: d => d.radius,
//             getFillColor: d => d.color,
//             getLineColor: [0, 0, 0]
//         })
//     ];
//
//     return (
//         <DeckGL
//             initialViewState={initialViewState}
//             controller={true}
//             layers={layers}
//         >
//             <Map
//                 // reuseMaps
//                 // mapStyle="mapbox://styles/mhmasuk/clidrsqvo003g01pmefnt8z07"
//                 mapStyle="https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json"
//                 // preventStyleDiffing={true}
//                 // style={{width: "100vw", height: "100vh"}}
//                 // mapboxApiAccessToken="pk.eyJ1IjoibWhtYXN1ayIsImEiOiJjbGljNXRpa24wa2c3M3JtdWJwM29zZDBzIn0.CsBqBqsiW7GvHMCz6YIxJg"
//             />
//         </DeckGL>
//     );
// }
//
// export default MapBoxMap;


import React from 'react';
import Map, { Marker } from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';

// Initial viewport settings
const initialViewState = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

// Data to be used by the layer
const data = [
  { position: [-122.41669, 37.7853], color: [255, 0, 0], radius: 100 }
];

// Marker position
const markerPosition = [-122.41669, 37.7853];

// DeckGL react component
const MapBoxMap = () => {
  const layers = [
    new ScatterplotLayer({
      id: 'scatterplot-layer',
      data,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 6,
      radiusMinPixels: 1,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      getPosition: d => d.position,
      getRadius: d => d.radius,
      getFillColor: d => d.color,
      getLineColor: [0, 0, 0]
    })
  ];

  return (
    <DeckGL
      initialViewState={initialViewState}
      controller={true}
      layers={layers}
    >
      <Map
        // reuseMaps
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json"
        // preventStyleDiffing={true}
        // mapboxApiAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
      >
        <Marker longitude={markerPosition[0]} latitude={markerPosition[1]}>
            <div style={{color: 'red'}}><h1>Marker Data</h1></div>
        </Marker>
      </Map>
    </DeckGL>
  );
}

export default MapBoxMap;