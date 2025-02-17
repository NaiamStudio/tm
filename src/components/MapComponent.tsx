
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for the default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

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
  const map = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current).setView([-31.4201, -64.1888], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    // Create a layer group for markers
    markersLayer.current = L.layerGroup().addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update markers when properties change
  useEffect(() => {
    if (!map.current || !markersLayer.current) return;

    // Clear existing markers
    markersLayer.current.clearLayers();

    // Add new markers
    properties.forEach((property) => {
      const marker = L.marker([property.coords[1], property.coords[0]])
        .bindPopup(`
          <h3 class="font-bold">${property.title}</h3>
          <p class="text-primary">$${property.price.toLocaleString()}/mes</p>
        `);
      marker.addTo(markersLayer.current!);
    });

    // Adjust map view to fit all markers if there are any
    if (properties.length > 0) {
      const bounds = L.latLngBounds(properties.map(p => [p.coords[1], p.coords[0]]));
      map.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [properties]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};
