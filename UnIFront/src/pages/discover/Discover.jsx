import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import './Discover.css';

const mapContainerStyle = {
  width: '100%',
  height: '75vh',
};

// Default center location set to UWF
const center = {
  lat: 30.5468,
  lng: -87.2174,
};

// Different map options
const options = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: true,
  fullscreenControl: true,
};

function Discover() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyA_3e2LYeVpVjp5kSkW5tFPcvmSudxqd8U",
    libraries: ['places'], // Used for autocomplete search. might not need depending on route we go
  });

  // State for markers/pins
  const [markers, setMarkers] = useState([]); // Stores pinned locations
  const [selected, setSelected] = useState(null); // Stores the currently selected marker (used for info window)
  const [markerTitle, setMarkerTitle] = useState(""); // Stores the title of the marker to be added

  // Ref to maintain map instance
  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // Pan to a location
  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  // Add a marker where the user clicks
  const onMapClick = useCallback((event) => {
    const newMarker = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      time: new Date(),
      title: markerTitle || "New Location",
    };

    setMarkers((current) => [...current, newMarker]);
    setMarkerTitle(""); // Reset the title input field
  }, [markerTitle]);

  // Handle loading and error states
  if (loadError) return <div className="error-message">Error loading maps</div>;
  if (!isLoaded) return <div className="loading-message">Loading maps...</div>;

  return (
    <div className="discover-container">
      <h1>Discover Locations</h1>
      
      <div className="map-controls">
        <div className="input-group">
          <label htmlFor="markerTitle">Location Name:</label>
          <input
            id="markerTitle"
            type="text"
            value={markerTitle}
            onChange={(e) => setMarkerTitle(e.target.value)}
            placeholder="Enter location name"
          />
        </div>
        <p className="instructions">Click on the map to add a new location pin</p>
      </div>

      <div className="map-container">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={15}
          center={center}
          options={options}
          onClick={onMapClick}
          onLoad={onMapLoad}
        >
          {/* Render pins/markers */}
          {markers.map((marker) => (
            <Marker
              key={`${marker.lat}-${marker.lng}-${marker.time.toISOString()}`}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => {
                setSelected(marker);
              }}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          ))}

          {/* Info window for selected marker */}
          {selected ? (
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => {
                setSelected(null);
              }}
            >
              <div className="info-window">
                <h2>{selected.title}</h2>
                <p>Latitude: {selected.lat.toFixed(6)}</p>
                <p>Longitude: {selected.lng.toFixed(6)}</p>
                <p>Added: {selected.time.toLocaleString()}</p>
              </div>
            </InfoWindow>
          ) : null}
        </GoogleMap>
      </div>

      <div className="locations-list">
        <h2>Saved Locations</h2>
        {markers.length === 0 ? (
          <p>No locations added yet. Click on the map to add locations.</p>
        ) : (
          <ul>
            {markers.map((marker, index) => (
              <li 
                key={index}
                onClick={() => {
                  setSelected(marker);
                  panTo({ lat: marker.lat, lng: marker.lng });
                }}
              >
                <strong>{marker.title}</strong>
                <small>Added: {marker.time.toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Discover;