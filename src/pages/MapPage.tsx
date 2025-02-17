
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { MapComponent } from "@/components/MapComponent";
import { Button } from "@/components/ui/button";
import { Search, Heart, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

const cordobaProperties = [
  {
    id: 1,
    title: "Apartamento de Lujo en Nueva Córdoba",
    type: "rent" as const,
    location: "Nueva Córdoba",
    price: 80000,
    coords: [-64.1888, -31.4201] as [number, number],
    bedrooms: 3,
    bathrooms: 2,
    area: "120 M²",
    furnished: true,
    parking: "Si",
    amenities: ["Cocina equipada", "Balcón", "Aire acondicionado"],
    whatsapp: "+5493512345678"
  },
  {
    id: 2,
    title: "Loft Moderno en Güemes",
    type: "sale" as const,
    location: "Güemes",
    price: 65000,
    coords: [-64.1900, -31.4250] as [number, number],
    bedrooms: 1,
    bathrooms: 1,
    area: "80 M²",
    furnished: false,
    parking: "No",
    amenities: ["Cocina integrada", "Terraza"],
    whatsapp: "+5493512345679"
  },
];

const MapPage = () => {
  const location = useLocation();
  const [showMap, setShowMap] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("Córdoba");
  const [priceRange, setPriceRange] = useState("");
  const [accommodationType, setAccommodationType] = useState("");
  const [listingType, setListingType] = useState("all");
  const [selectedProperty, setSelectedProperty] = useState<typeof cordobaProperties[0] | null>(null);

  const filteredProperties = cordobaProperties.filter(property => {
    if (listingType === "all") return true;
    return property.type === listingType;
  });

  const handlePropertySelect = (property: typeof cordobaProperties[0]) => {
    setSelectedProperty(property);
  };

  const handleContactWhatsApp = (whatsappNumber: string) => {
    const message = encodeURIComponent(`Hola, me interesa la propiedad en ${selectedProperty?.location}`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black/90 to-[#F97316]/20">
      <nav className="border-b border-white/10">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold">
            Terracarta
          </Link>
          <div className="flex gap-4">
            <Button variant="ghost" className="text-white">
              Buscar
            </Button>
            <Button variant="ghost" className="text-white">
              ES
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Seleccionar ubicación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Córdoba">Córdoba</SelectItem>
                <SelectItem value="Nueva Córdoba">Nueva Córdoba</SelectItem>
                <SelectItem value="Güemes">Güemes</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Precio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-50000">$0 - $50.000</SelectItem>
                <SelectItem value="50000-100000">
                  $50.000 - $100.000
                </SelectItem>
                <SelectItem value="100000+">$100.000+</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={accommodationType}
              onValueChange={setAccommodationType}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tipo de propiedad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flat">Departamento</SelectItem>
                <SelectItem value="house">Casa</SelectItem>
                <SelectItem value="loft">Loft</SelectItem>
              </SelectContent>
            </Select>

            <Select value={listingType} onValueChange={setListingType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tipo de operación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Mostrar todas</SelectItem>
                <SelectItem value="rent">Alquiler</SelectItem>
                <SelectItem value="sale">Venta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-white">Mostrar mapa</span>
            <Switch
              checked={showMap}
              onCheckedChange={setShowMap}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handlePropertySelect(property)}
              >
                <div className="relative h-48 bg-primary">
                  <div className={`absolute inset-0 ${
                    property.type === 'rent' ? 'bg-[#7FFFD4]/20' : 'bg-[#FEF7CD]/20'
                  }`} />
                </div>
                <div className="p-4">
                  <div className="inline-block px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary mb-2">
                    {property.type === 'rent' ? 'ALQUILER' : 'VENTA'}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{property.location}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-primary">
                      ${property.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {property.type === 'rent' ? '/mes' : ''}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showMap && (
            <div className="h-[calc(100vh-200px)] sticky top-24">
              <MapComponent 
                properties={filteredProperties}
                onPropertySelect={handlePropertySelect}
              />
            </div>
          )}
        </div>
      </div>

      {selectedProperty && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start p-4 border-b">
              <div>
                <h2 className="text-2xl font-bold">{selectedProperty.title}</h2>
                <p className="text-gray-600">{selectedProperty.location}</p>
              </div>
              <button 
                onClick={() => setSelectedProperty(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Características</h3>
                  <ul className="space-y-2">
                    <li>Habitaciones: {selectedProperty.bedrooms}</li>
                    <li>Baños: {selectedProperty.bathrooms}</li>
                    <li>Área: {selectedProperty.area}</li>
                    <li>Amoblado: {selectedProperty.furnished ? 'Si' : 'No'}</li>
                    <li>Estacionamiento: {selectedProperty.parking}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Amenities</h3>
                  <ul className="space-y-2">
                    {selectedProperty.amenities.map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold text-primary">
                  ${selectedProperty.price.toLocaleString()}
                  {selectedProperty.type === 'rent' && <span className="text-sm text-gray-500 ml-1">/mes</span>}
                </div>
                <Button 
                  className="bg-[#25D366] hover:bg-[#25D366]/90 text-white"
                  onClick={() => handleContactWhatsApp(selectedProperty.whatsapp)}
                >
                  Contactar por WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="container mx-auto p-4 text-center text-white">
        <p>
          2025 Terracarta - Desarrollado por{" "}
          <a
            href="https://naiam.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80"
          >
            naiam
          </a>
        </p>
      </footer>
    </div>
  );
};

export default MapPage;
