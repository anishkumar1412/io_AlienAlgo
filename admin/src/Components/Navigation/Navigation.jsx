import React, { useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-ant-path';
import './Navigation.css';  // You can include your styles here

const AntPathMap = () => {
  // GeoJSON data
  const geoJsonData = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "coordinates": [
            [85.84203832410657, 20.264565654149948],
            [85.84193070647001, 20.264629593243967],
            [85.84215670347743, 20.26488198405758],
            [85.842149528969, 20.265120913648047],
            [85.84204191134694, 20.26518821769136]
          ],
          "type": "LineString"
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "coordinates": [
            [-66.06701961683106, 18.368953031100574],
            [-66.06668880136986, 18.36885610401275],
            [-66.06679315255597, 18.3685800722251],
            [-66.06689750374126, 18.368613786054482],
            [-66.06700185492738, 18.36851896589178],
            [-66.06713284896863, 18.36847471646425],
            [-66.06722165848866, 18.368601143369432],
            [-66.06725718229609, 18.36864539276452],
            [-66.06738595610044, 18.368571643766373],
            [-66.06731712872255, 18.368476823579783],
            [-66.06725718229609, 18.368504216083863]
          ],
          "type": "LineString"
        }
      }
    ]
  };

  // Add Ant Path and markers after map renders
  const addAntPathWithMarkers = (map) => {
    geoJsonData.features.forEach((feature) => {
      const coords = feature.geometry.coordinates.map(c => [c[1], c[0]]); // Reverse lat/lng
      const start = coords[0];
      const end = coords[coords.length - 1];

      // Add Warehouse Center marker at the start point
      L.marker(start).addTo(map)
        .bindPopup('Warehouse Center')
        .openPopup();

      // Add Speaker marker at the end point
      L.marker(end).addTo(map)
        .bindPopup('Speaker')
        .openPopup();

      // Create Ant Path
      L.polyline.antPath(coords, {
        color: '#FF0000', // Red path
        delay: 1000,
        pulseColor: '#FFFFFF', // White pulsing effect
        weight: 5,
        dashArray: [20, 20],
        paused: false,
        reverse: false,
        hardwareAccelerated: true
      }).addTo(map);
    });
  };

  useEffect(() => {
    const map = L.map('map').setView([20.264565654149948, 85.84203832410657], 15);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Add Ant Path and Markers
    addAntPathWithMarkers(map);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div>
      <div id="map" style={{ height: '400px', width: '80%', marginLeft: '200' }}></div>
    </div>
  );
};

export default AntPathMap;
