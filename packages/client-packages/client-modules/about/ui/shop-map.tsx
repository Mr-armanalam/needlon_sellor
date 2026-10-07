'use client'
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";

export default function IMap() {
  const data = {
    latitude: 18.6885178,
    longitude: 73.7902138,
    zoom: 4,
  };
  return (
    <div className="h-125">
      <Map
        mapLib={maplibregl}
        initialViewState={data}
        mapStyle={`https://api.maptiler.com/maps/basic-v2/style.json?key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`}
      >
        <NavigationControl position="top-left" />
        <Marker
          latitude={data.latitude}
          longitude={data.longitude}
          color="#61dbdd"
        />
      </Map>
    </div>
  );
}