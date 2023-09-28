"use client";

import React, {useState} from 'react';
import DeckGL from '@deck.gl/react';
import {ScatterplotLayer} from '@deck.gl/layers';

const data = [
    {position: [-122.45, 37.78], message: 'Hover over me'}
];

const HoberMap = () => {
    const [hoverInfo, setHoverInfo] = useState({position: [-122.45, 37.78], message: 'Hover over me'});

    const layers = [
        new ScatterplotLayer({
            data,
            getPosition: d => d.position,
            getRadius: 1000,
            getFillColor: [255, 255, 0],
            // Enable picking
            pickable: true,
            // Update app state
            onHover: info => setHoverInfo(info)
        })
    ];

    return (
        <div>
            <DeckGL initialViewState={{longitude: -122.45, latitude: 27.78, zoom: 4}}
                    controller={true}
                    layers={layers} >
                {hoverInfo.object && (
                    <div style={{position: 'absolute', zIndex: 99, pointerEvents: 'none', left: hoverInfo.x, top: hoverInfo.y}}>
                        { hoverInfo.object.message }
                    </div>
                )}
            </DeckGL>
        </div>
    );
}

export default HoberMap