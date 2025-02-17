
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Property {
  id: number;
  coords: [number, number];
  title: string;
  price: number;
}

interface MapComponentProps {
  properties: Property[];
}

export const MapComponent = ({ properties }: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState(localStorage.getItem('mapbox_token') || '');

  useEffect(() => {
    if (!mapContainer.current || !token) return;

    try {
      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-64.1888, -31.4201], // Córdoba, Argentina
        zoom: 13,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      properties.forEach((property) => {
        const marker = new mapboxgl.Marker()
          .setLngLat(property.coords)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<h3 class="font-bold">${property.title}</h3>
               <p class="text-primary">$${property.price.toLocaleString()}/mes</p>`
            )
          )
          .addTo(map.current!);
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      map.current?.remove();
    };
  }, [properties, token]);

  if (!token) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Configuración del Mapa</h3>
        <p className="mb-4">Para ver el mapa, ingresa tu token público de Mapbox:</p>
        <input
          type="text"
          className="w-full p-2 border rounded mb-2"
          placeholder="Ingresa tu token de Mapbox"
          onChange={(e) => {
            const newToken = e.target.value;
            setToken(newToken);
            localStorage.setItem('mapbox_token', newToken);
          }}
        />
        <p className="text-sm text-gray-600">
          Puedes obtener tu token en <a href="https://www.mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary">mapbox.com</a>
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};
