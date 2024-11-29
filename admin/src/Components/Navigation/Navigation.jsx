import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-ant-path';
import './Navigation.css';

const AntPathMap = () => {
  // Sample GeoJSON data with updated coordinates for different paths
  const geoJsonData = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": { "name": "Path 1" },
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [85.84203832410657, 20.264565654149948],
            [85.84193070647001, 20.264629593243967],
            [85.84215670347743, 20.26488198405758],
            [85.842149528969, 20.265120913648047],
            [85.84204191134694, 20.26518821769136]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Path 2" },
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [-66.0671, 18.3689],
            [-66.0669, 18.3687],
            [-66.0667, 18.3686],
            [-66.0665, 18.3685],
            [-66.0663, 18.3684],
            [-66.0661, 18.3683]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Path 3" },
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [85.841500, 20.265500],
            [85.841600, 20.265800],
            [85.841800, 20.266000],
            [85.842000, 20.266200]
          ]
        }
      }
    ]
  };

  const [selectedPath, setSelectedPath] = useState(null);

  const addAntPathWithMarkers = (map, path) => {
    const coords = path.geometry.coordinates.map(c => [c[1], c[0]]);
    const start = coords[0];
    const end = coords[coords.length - 1];

    // Add markers for start and end points
    L.marker(start).addTo(map).bindPopup('Start Point');
    L.marker(end).addTo(map).bindPopup('End Point');

    // Create Ant Path
    L.polyline.antPath(coords, {
      color: '#008080',  // Teal path color
      delay: 800,        // Faster animation
      pulseColor: '#FFD700', // Gold pulsing effect
      weight: 6,         // Thicker path for better visibility
      dashArray: [15, 15],
      paused: false,
      reverse: false,
      hardwareAccelerated: true
    }).addTo(map);

    // Fit map bounds to the selected path
    map.fitBounds(coords);
  };

  useEffect(() => {
    const map = L.map('map').setView([20.264565654149948, 85.84203832410657], 15);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Add selected path if available
    if (selectedPath) {
      addAntPathWithMarkers(map, selectedPath);
    }

    return () => {
      map.remove();
    };
  }, [selectedPath]);

  const handleSelectPath = (pathName) => {
    const path = geoJsonData.features.find(feature => feature.properties.name === pathName);
    setSelectedPath(path);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Dropdown menu to select the destination path */}
      <select onChange={(e) => handleSelectPath(e.target.value)} style={{ margin: '10px', padding: '8px', fontSize: '16px' }}>
        <option value="">Select Destination</option>
        {geoJsonData.features.map((feature, index) => (
          <option key={index} value={feature.properties.name}>
            {feature.properties.name}
          </option>
        ))}
      </select>

      {/* Map container */}
      <div id="map" style={{ height: '400px', width: '100%', maxWidth: '1000px', borderRadius: '8px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)' }}></div>
    </div>
  );
};

export default AntPathMap;
