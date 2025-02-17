
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for the default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

interface Property {
  id: number;
  coords: [number, number];
  title: string;
  price: number;
  type: 'rent' | 'sale';
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

    map.current = L.map(mapContainer.current).setView([-31.4201, -64.1888], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    markersLayer.current = L.layerGroup().addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || !markersLayer.current) return;

    markersLayer.current.clearLayers();

    properties.forEach((property) => {
      const markerColor = property.type === 'rent' ? '#7FFFD4' : '#FEF7CD';
      
      const markerHtmlStyles = `
        background-color: ${markerColor};
        width: 2rem;
        height: 2rem;
        display: block;
        position: relative;
        border-radius: 50%;
        border: 2px solid #FFF;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      `;

      const icon = L.divIcon({
        className: 'custom-pin',
        html: `<span style="${markerHtmlStyles}"></span>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([property.coords[1], property.coords[0]], { icon })
        .bindPopup(`
          <h3 class="font-bold">${property.title}</h3>
          <p class="text-primary">$${property.price.toLocaleString()}/mes</p>
        `);
      marker.addTo(markersLayer.current!);
    });

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
