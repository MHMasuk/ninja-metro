"use client"

import React, { useState } from "react";
import ReactDOM from "react-dom";
import DeckGL, { ScatterplotLayer } from "deck.gl";
import Map, { _MapContext as MapContext, Popup } from "react-map-gl/maplibre";

const MAPBOX_ACCESS_TOKEN =
    "pk.eyJ1IjoiZ2Vvcmdpb3MtdWJlciIsImEiOiJjanZidTZzczAwajMxNGVwOGZrd2E5NG90In0.gdsRu_UeU_uPi9IulBruXA";

const initialViewState = {
    longitude: -73.9,
    latitude: 40.73,
    zoom: 9
};

const DATA = [
    [-74.0331, 40.7378, "thing 1"],
    [-73.9991, 40.7236, "thing 2"],
    [-73.9991, 40.7357, "thing 3"],
    [-73.9768, 40.7553, "thing 4"],
    [-73.9768, 40.7627, "thing 5"],
    [-73.9767, 40.644, "thing 6"],
    [-73.9767, 40.6497, "thing 7"],
    [-73.9677, 40.7689, "thing 8"],
    [-73.9676, 40.5969, "thing 9"],
    [-73.9676, 40.6047, "thing 10"],
    [-73.9442, 40.708, "thing 11"]
];

const  PopupDemo = () => {
    const [selected, setSelected] = useState(null);
    const [toggle, setToggle] = useState(false);

    const layers = [
        new ScatterplotLayer({
            id: "layer-1",
            data: DATA,
            radiusUnits: "pixels",
            getRadius: 5,
            getPosition: (d) => [d[0], d[1]],
            pickable: true
        })
    ];

    return (
        <DeckGL
            initialViewState={initialViewState}
            layers={layers}
            controller={true}
            // ContextProvider={MapContext.Provider}
            onClick={({ x, y, coordinate, lngLat, layer, color, object, index }) => {
                // TODO: figure out how to get rid of extra click event
                console.log("deck onClick", object);
                if (object) {
                    setSelected({ x, y, coordinate, object });
                } else {
                    // clicked off an object
                    setSelected(null);
                }
            }}
        >
            <>
                <Map mapStyle="https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json"/>
                {selected && (
                    <Popup
                        longitude={selected.coordinate[0]}
                        latitude={selected.coordinate[1]}
                        closeButton={false}
                        anchor="left"
                        offsetLeft={10}
                    >
                        <div>
                            {toggle && (
                                <div>
                                    Content A<br />
                                    {/* Clicking this button makes it go away and deck.gl's onClick fires */}
                                    <button onClick={() => setToggle(!toggle)}>
                                        Change to B
                                    </button>
                                </div>
                            )}
                            {!toggle && (
                                <div>
                                    Content B<br />
                                    {/* Clicking this button makes it go away and deck.gl's onClick fires */}
                                    <button onClick={() => setToggle(!toggle)}>
                                        Change to A
                                    </button>
                                </div>
                            )}
                            {/* Clicking this button does not fire deck.gl's onClick */}
                            <button onClick={() => setToggle(!toggle)}>Toggle</button>
                        </div>
                    </Popup>
                )}
            </>
        </DeckGL>
    );
}

export default PopupDemo