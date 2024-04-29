"use client"

import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';

const Map = ({ stops }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [eta, setEta] = useState(null);
  const [isMapsLoaded, setIsMapsLoaded] = useState(false);
  const [directions, setDirections] = useState(null);

  const mapStyles = {
    height: 'calc(100vh - 200px)',
    width: '100%'
  };

  const defaultCenter = {
    lat: -1.939826787816454,
    lng: 30.0445426438232,
  };

  useEffect(() => {
    navigator.geolocation.watchPosition(
      position => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      error => {
        console.error("Error getting the geolocation: ", error);
      }
    );
  }, []);

  useEffect(() => {
    if (directions) {
      let totalDuration = 0;
      directions.routes[0].legs.forEach(leg => {
        totalDuration += leg.duration.value;
      });
      const etaMinutes = Math.round(totalDuration / 60);
      setEta(etaMinutes);
    }
  }, [directions]);
  

  useEffect(() => {
    if (currentLocation && stops.length > 1 && window.google) {
      const origin = new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng);
      const destination = new window.google.maps.LatLng(stops[stops.length - 2].lat, stops[stops.length - 2].lng);
      const waypoints = stops.slice(0, -1).map(stop => ({
        location: { lat: stop.lat, lng: stop.lng },
        stopover: true
      }));
  
      const directionsService = new window.google.maps.DirectionsService();
  
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          optimizeWaypoints: true,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    }
  }, [currentLocation, stops, isMapsLoaded]);
  

  return (
    <div className="relative">
      <LoadScript
        googleMapsApiKey="AIzaSyASH4t1QN35rcA2FIGnZ4jxZKnJvKrtWxY"
        libraries={["geometry"]}
        onLoad={() => setIsMapsLoaded(true)}
      >
        <GoogleMap
  mapContainerStyle={mapStyles}
  zoom={12}
  center={defaultCenter}
>
  {stops.slice(0, -1).map((stop, index) => (
    <Marker key={index} position={{ lat: stop.lat, lng: stop.lng }} />
  ))}
  {currentLocation && <Marker position={{ lat: currentLocation.lat, lng: currentLocation.lng }} />}
  {directions && <DirectionsRenderer directions={directions} options={{ polylineOptions: { strokeColor: 'green' } }} />}
</GoogleMap>

      </LoadScript>
      <div className="absolute bottom-0 left-0 w-full bg-white p-4">
        <p className="text-black text-lg font-bold">{stops[0].name} - {stops[stops.length - 1].name}</p>
        <p className='text-black'>Next Stop: {stops[1]?.name}</p>
        {eta && <p className='text-black'>ETA: {eta} mins</p>}
      </div>
    </div>
  );
};

export default Map;
