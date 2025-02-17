
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Property {
  id: number;
  coords: [number, number];
  title: string;
  price: number;
  type: 'rent' | 'sale';
  bedrooms: number;
  bathrooms: number;
  area: string;
  location: string;
}

interface MapComponentProps {
  properties: Property[];
  onPropertySelect: (property: Property) => void;
}

export const MapComponent = ({ properties, onPropertySelect }: MapComponentProps) => {
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
      const markerColor = property.type === 'rent' ? '#FFFFFF' : '#000000';
      
      const markerHtmlStyles = `
        background-color: ${markerColor};
        width: 1rem;
        height: 1.5rem;
        display: block;
        position: relative;
        border-radius: 0.5rem 0.5rem 1rem 1rem;
        transform: rotate(45deg);
        border: 2px solid #000000;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        &:after {
          content: '';
          width: 0.5rem;
          height: 0.5rem;
          margin: 0.25rem auto;
          background: #000000;
          border-radius: 50%;
          display: block;
        }
      `;

      const icon = L.divIcon({
        className: 'custom-pin',
        html: `<span style="${markerHtmlStyles}"></span>`,
        iconSize: [24, 36],
        iconAnchor: [12, 36],
        popupAnchor: [0, -36],
        tooltipAnchor: [12, -24]
      });

      const marker = L.marker([property.coords[1], property.coords[0]], { icon })
        .bindTooltip(property.title)
        .on('click', () => onPropertySelect(property));
      
      marker.addTo(markersLayer.current!);
    });

    if (properties.length > 0) {
      const bounds = L.latLngBounds(properties.map(p => [p.coords[1], p.coords[0]]));
      map.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [properties, onPropertySelect]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};
