import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useUser } from '../../components/userContext/UserContext';
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
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [error, setError] = useState(null); // Error state for API calls
  
  // Get user context for authentication
  const { token } = useUser();

  // Ref to maintain map instance
  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);
  
  // Fetch all locations from the backend when component mounts
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/locations');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch locations: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Convert backend locations to marker format
        const backendMarkers = data.map(location => ({
          id: location._id,
          lat: parseFloat(location.latitude),
          lng: parseFloat(location.longitude),
          title: location.name,
          address: location.address,
          city: location.city,
          state: location.state,
          time: new Date(location.createdAt),
          averageRating: location.averageRating
        }));
        
        setMarkers(backendMarkers);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchLocations();
  }, []);

  // Pan to a location
  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  // Save a new location to the backend
  const saveLocationToBackend = async (locationData) => {
    try {
      const response = await fetch('http://localhost:5000/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(locationData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save location: ${response.status}`);
      }
      
      const savedLocation = await response.json();
      return savedLocation;
    } catch (err) {
      console.error('Error saving location:', err);
      setError(err.message);
      return null;
    }
  };

  // Add a marker where the user clicks
  const onMapClick = useCallback(async (event) => {
    if (!markerTitle) {
      alert("Please enter a location name before adding a marker");
      return;
    }
    
    const latitude = event.latLng.lat();
    const longitude = event.latLng.lng();
    
    const locationData = {
      name: markerTitle,
      address: "N/A",
      city: "N/A",
      state: "N/A",
      latitude: latitude.toString(),
      longitude: longitude.toString()
    };
    
    // Save to backend
    const savedLocation = await saveLocationToBackend(locationData);
    
    if (savedLocation) {
      const newMarker = {
        id: savedLocation._id,
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
        title: markerTitle,
        time: new Date(),
        averageRating: savedLocation.averageRating || 0
      };
      
      setMarkers((current) => [...current, newMarker]);
      
      // Reset the input field
      setMarkerTitle("");
    }
  }, [markerTitle, token, saveLocationToBackend]);

  // Handle loading and error states
  if (loadError) return <div className="error-message">Error loading maps</div>;
  if (!isLoaded) return <div className="loading-message">Loading maps...</div>;
  if (loading) return <div className="loading-message">Loading locations...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

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
            required
          />
        </div>
        <p className="instructions">Click on the map to select a location. Only coordinates will be saved.</p>
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
              key={marker.id || `${marker.lat}-${marker.lng}-${marker.time ? marker.time.toISOString() : Date.now()}`}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => setSelected(marker)}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          ))}
          {selected && (
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => setSelected(null)}
            >
              <div className="info-window">
                <h2 style={{ color: '#2d4181', marginBottom: '8px', fontSize: '18px', fontWeight: 'bold' }}>
                  {selected.title}
                </h2>
                <p style={{ fontSize: '14px', marginTop: '5px', color: '#555' }}>
                  Coordinates: ({selected.lat.toFixed(6)}, {selected.lng.toFixed(6)})
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

export default Discover;