import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon } from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

import 'leaflet/dist/leaflet.css';

const WorldMap = ({ onLocationClick, coordinates }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Create the map only if it hasn't been created yet
    if (!mapRef.current) {
      const initialLatitude = coordinates?.lat || 0;
      const initialLongitude = coordinates?.lng || 0;

      const map = L.map('map').setView([initialLatitude, initialLongitude], 10);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        language: 'en',
      }).addTo(map);

      map.getContainer().style.height = '100vh';
      map.getContainer().style.width = '100%';

      // Create marker with initial coordinates
      createMarker(initialLatitude, initialLongitude);

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;

        if (markerRef.current) {
          mapRef.current.removeLayer(markerRef.current);
        }

        // Create marker with clicked coordinates
        createMarker(lat, lng);

        // Trigger the callback when a location is clicked
        onLocationClick({ latitude: lat, longitude: lng });
      });
    }
  }, [onLocationClick, coordinates]);

  // Update map view when coordinates change
  useEffect(() => {
    if (mapRef.current && coordinates) {
      mapRef.current.setView([coordinates.lat, coordinates.lng], 10);

      // Update marker position when coordinates change
      if (markerRef.current) {
        markerRef.current.setLatLng([coordinates.lat, coordinates.lng]);
      }
    }
  }, [coordinates]);

  const createMarker = (lat, lng) => {
    const customIcon = divIcon({
      className: 'custom-marker-icon',
      html: renderToStaticMarkup(
        <FontAwesomeIcon icon={faLocationDot} style={{ fontSize: '32px', color: '#ff0000' }} />
      ),
    });

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(mapRef.current);

    markerRef.current = marker;
  };

  return <div id="map" style={{ height: '100vh', width: '100%' }}></div>;
};

export default WorldMap;
