import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useUser } from '../../components/userContext/UserContext';
import './Discover.css';

const mapContainerStyle = {
  width: '100%',
  height: '90vh',
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
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);

  // Get user context for authentication
  const { user, token } = useUser();

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

  // on a marker click, we need to grab the ratings as well, which would be in the back end.
  const onMarkerClick = async (marker) => {
    let ratings = [];
    console.log(marker.id);
    try {
      const response = await fetch(`http://localhost:5000/locations/${marker.id}/ratings/location/${marker.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      ratings = await response.json()
      console.log(ratings);

      // Fetch user info for each rating
      const ratingsWithUsers = await Promise.all(ratings.map(async (rating) => {
        try {
          const userResponse = await fetch(`http://localhost:5000/users/profile/${rating.userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!userResponse.ok) {
            throw new Error(`User fetch failed for ID: ${rating.userId}`);
          }

          const user = await userResponse.json();
          return {
            ...rating,
            user, // attach full user info
          };
        } catch (err) {
          console.error(`Error fetching user ${rating.userId}:`, err);
          return {
            ...rating,
            user: { username: 'Unknown' }, // fallback
          };
        }
      }));


      setSelected({ ...marker, ratings: ratings || [] });
      setIsInfoWindowOpen(true);


    } catch (err) {
      console.error('Failed to load ratings:', err);
    }

  };



  const submitRating = async (locationId) => {
    console.log('Submitting rating for location:', locationId);
    if (!rating) {
      alert("please elect a rating before submitting.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/locations/${locationId}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          "value": parseInt(rating),
          "text": comment,
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        console.log("Content-Type:", contentType);

        const text = await response.text();
        console.log("Raw response text:", text);

        throw new Error('Failed to submit rating');
      }

      setRating('');
      setComment('');
    } catch (error) {
      console.error(error);
    }
  };
  const deleteLocation = async (locationId) => {
    try {
      const response = await fetch(`http://localhost:5000/locations/${locationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete Location');
      }
    } catch (error) {
      console.error(error);
    }

    setMarkers((current) => current.filter(marker => marker.id !== locationId));

    setSelected(null);
    setIsInfoWindowOpen(false);
  };

  const deleteRating = async (ratingId) => {
    console.log(`Deleting rating with id: ${ratingId}`);

    try {
      const response = await fetch(`http://localhost:5000/locations/${locationId}/ratings/${ratingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        console.log("Content-Type:", contentType);

        const text = await response.text();
        console.log("Raw response text:", text);

        throw new Error('Failed to submit rating');
      }
    } catch (error) {
      console.error(error);
    }

    console.log(user._id);
  }



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
          options={{
            ...options,
            //gestureHandling: isInfoWindowOpen ? 'none' : 'auto', // Disable map interaction when info window is open
          }}
          onClick={onMapClick}
          onLoad={onMapLoad}
        >
          {/* Render pins/markers */}
          {markers.map((marker) => (
            <Marker
              key={marker.id || `${marker.lat}-${marker.lng}-${marker.time ? marker.time.toISOString() : Date.now()}`}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => {
                onMarkerClick(marker);
              }}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          ))}
          {/* Info window for selected marker Add on selected, to get the ratings of the location by name or id. */}

          {selected && (
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => {
                setSelected(null);
                setIsInfoWindowOpen(false);
              }}
            >
              <div className="info-window">
                <div className="info-header">
                  <h2>{selected.title}</h2>
                  {user && (
                    <button className="delete-button" onClick={() => deleteLocation(selected.id)}>
                      🗑️
                    </button>
                  )}
                </div>

                <p>Added: {selected.time.toLocaleString()}</p>
                <h3 style={{ fontSize: '30px', fontStyle: 'bold' }}>Ratings:</h3>

                <div className="ratings-list">

                  {selected.ratings?.length ? (
                    selected.ratings.map((r, i) => (

                      <div key={i}>
                        <div className="rating-box">
                          <div className="rater-name">{r.user || 'Anonymous'}</div>
                          <div className="rating-text">
                            <div className="star-rating">⭐<p>{r.value}</p></div>
                            {r.text || 'No comment'}
                          </div>

                          {user && r.user === user.username && (
                            <button className="delete-button" onClick={() => deleteRating(r._id)}>
                              🗑️
                            </button>
                          )}


                        </div>
                      </div>

                    ))
                  ) : (
                    <p>No ratings yet.</p>
                  )}
                </div>

                {/* New Rating Form, only if user */}
                {user && (
                  <div className="add-rating-form">
                    <label>
                      Your Rating:
                      <select value={rating} onChange={(e) => setRating(e.target.value)}>
                        <option value="">Select</option>
                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Leave a comment (optional)"
                    />
                    <button onClick={() => submitRating(selected.id)}>Submit</button>
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
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
                  onMarkerClick(marker);
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