"use client"

import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';

const Map = ({ stops }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nextStopIndex, setNextStopIndex] = useState(0);
  const [eta, setEta] = useState(null);
  const [isMapsLoaded, setIsMapsLoaded] = useState(false); 

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
    if (currentLocation && stops.length > 1 && window.google) {
      // Ensure Google Maps API is loaded
      const nextStop = stops[nextStopIndex];
      const origin = new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng);
      const destination = new window.google.maps.LatLng(nextStop.lat, nextStop.lng);
      const distance = window.google.maps.geometry.spherical.computeDistanceBetween(origin, destination);
      const averageSpeed = 50; // km/h
      const timeInHours = distance / averageSpeed / 1000;
      const etaInSeconds = timeInHours * 3600;
      setEta(Math.ceil(etaInSeconds / 60));
    }
  }, [currentLocation, stops, nextStopIndex, isMapsLoaded]);

  return (
    <div className="relative">
      <LoadScript
        googleMapsApiKey="AIzaSyASH4t1QN35rcA2FIGnZ4jxZKnJvKrtWxY"
        libraries={["geometry"]} // Load the geometry library
        onLoad={() => setIsMapsLoaded(true)}
      >

        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={12}
          center={defaultCenter}
        >
          {stops.map((stop, index) => (
            <Marker key={index} position={{ lat: stop.lat, lng: stop.lng }} />
          ))}
          {currentLocation && <Marker position={{ lat: currentLocation.lat, lng: currentLocation.lng }} />}
        </GoogleMap>
      </LoadScript>
      <div className="absolute bottom-0 left-0 w-full bg-white p-4">
        {/* Banner with details */}
        <p className="text-black text-lg font-bold">Nyabugogo - Kimironko</p>
        <p className='text-black'>Next Stop: {stops[nextStopIndex]?.name}</p>
        {eta && <p className='text-black'>ETA: {eta} mins</p>}
      </div>
      
    </div>
  );
};

export default Map;
