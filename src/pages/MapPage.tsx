import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { MapComponent } from "@/components/MapComponent";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PropertyFilters } from "@/components/PropertyFilters";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyDetails } from "@/components/PropertyDetails";

const locations = [
  "Sin filtrar",
  "Nueva Córdoba, Ciudad de Córdoba, Córdoba",
  "Centro, Ciudad de Córdoba, Córdoba",
  "Alberdi, Ciudad de Córdoba, Córdoba",
  "Güemes, Ciudad de Córdoba, Córdoba",
  "General Paz, Ciudad de Córdoba, Córdoba",
  "Alta Córdoba, Ciudad de Córdoba, Córdoba"
];

const cordobaProperties = [
  {
    id: 1,
    title: "Apartamento de Lujo en Nueva Córdoba",
    type: "rent" as const,
    location: "Nueva Córdoba, Ciudad de Córdoba, Córdoba",
    price: 80000,
    coords: [-64.1888, -31.4201] as [number, number],
    bedrooms: 3,
    bathrooms: 2,
    area: "120 M²",
    furnished: true,
    parking: "Si",
    amenities: ["Cocina equipada", "Balcón", "Aire acondicionado"],
    whatsapp: "+5493512345678",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Apartamentos_-_panoramio.jpg/1280px-Apartamentos_-_panoramio.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Apartamentos_-_panoramio.jpg/1280px-Apartamentos_-_panoramio.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Modern_urban_living_room.jpg/1280px-Modern_urban_living_room.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Penthouse_balcony.jpg/1280px-Penthouse_balcony.jpg"
    ]
  },
  {
    id: 2,
    title: "Loft Moderno en Güemes",
    type: "sale" as const,
    location: "Güemes, Ciudad de Córdoba, Córdoba",
    price: 65000,
    coords: [-64.1900, -31.4250] as [number, number],
    bedrooms: 1,
    bathrooms: 1,
    area: "80 M²",
    furnished: false,
    parking: "No",
    amenities: ["Cocina integrada", "Terraza"],
    whatsapp: "+5493512345679",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Loft_room.jpg/1280px-Loft_room.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Loft_room.jpg/1280px-Loft_room.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Modern_urban_living_room.jpg/1280px-Modern_urban_living_room.jpg"
    ]
  },
  {
    id: 3,
    title: "Casa Familiar en Alto Alberdi",
    type: "sale" as const,
    location: "Alberdi, Ciudad de Córdoba, Córdoba",
    price: 120000,
    coords: [-64.2000, -31.4100] as [number, number],
    bedrooms: 4,
    bathrooms: 2,
    area: "180 M²",
    furnished: false,
    parking: "Si",
    amenities: ["Patio amplio", "Parrilla", "Jardín"],
    whatsapp: "+5493512345680",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Casa_Modernista.jpg/1280px-Casa_Modernista.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Casa_Modernista.jpg/1280px-Casa_Modernista.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Penthouse_balcony.jpg/1280px-Penthouse_balcony.jpg"
    ]
  },
  {
    id: 4,
    title: "Estudio en Centro",
    type: "rent" as const,
    location: "Centro, Ciudad de Córdoba, Córdoba",
    price: 45000,
    coords: [-64.1850, -31.4150] as [number, number],
    bedrooms: 1,
    bathrooms: 1,
    area: "45 M²",
    furnished: true,
    parking: "No",
    amenities: ["Cocina americana", "Internet incluido"],
    whatsapp: "+5493512345681",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Modern_urban_living_room.jpg/1280px-Modern_urban_living_room.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Modern_urban_living_room.jpg/1280px-Modern_urban_living_room.jpg"
    ]
  },
  {
    id: 5,
    title: "Penthouse en Nueva Córdoba",
    type: "sale" as const,
    location: "Nueva Córdoba, Ciudad de Córdoba, Córdoba",
    price: 250000,
    coords: [-64.1870, -31.4220] as [number, number],
    bedrooms: 3,
    bathrooms: 3,
    area: "200 M²",
    furnished: false,
    parking: "Si",
    amenities: ["Terraza privada", "Jacuzzi", "Vista panorámica"],
    whatsapp: "+5493512345682",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Penthouse_balcony.jpg/1280px-Penthouse_balcony.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Penthouse_balcony.jpg/1280px-Penthouse_balcony.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Modern_urban_living_room.jpg/1280px-Modern_urban_living_room.jpg"
    ]
  },
  {
    id: 6,
    title: "Duplex en Cofico",
    type: "rent" as const,
    location: "Cofico, Ciudad de Córdoba, Córdoba",
    price: 90000,
    coords: [-64.1920, -31.4000] as [number, number],
    bedrooms: 2,
    bathrooms: 2,
    area: "110 M²",
    furnished: true,
    parking: "Si",
    amenities: ["Patio", "Lavadero", "Seguridad 24hs"],
    whatsapp: "+5493512345683",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Modern_duplex_house.jpg/1280px-Modern_duplex_house.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Modern_duplex_house.jpg/1280px-Modern_duplex_house.jpg"
    ]
  },
  {
    id: 7,
    title: "Casa en Villa Belgrano",
    type: "sale" as const,
    location: "Villa Belgrano, Ciudad de Córdoba, Córdoba",
    price: 320000,
    coords: [-64.2100, -31.3900] as [number, number],
    bedrooms: 5,
    bathrooms: 4,
    area: "350 M²",
    furnished: false,
    parking: "Si",
    amenities: ["Pileta", "Jardín", "Quincho"],
    whatsapp: "+5493512345684",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Luxury_house_with_pool.jpg/1280px-Luxury_house_with_pool.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Luxury_house_with_pool.jpg/1280px-Luxury_house_with_pool.jpg"
    ]
  },
  {
    id: 8,
    title: "Departamento en General Paz",
    type: "rent" as const,
    location: "General Paz, Ciudad de Córdoba, Córdoba",
    price: 70000,
    coords: [-64.1750, -31.4050] as [number, number],
    bedrooms: 2,
    bathrooms: 1,
    area: "85 M²",
    furnished: true,
    parking: "No",
    amenities: ["Balcón", "Aire acondicionado"],
    whatsapp: "+5493512345685",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Modern_apartment_building_facade.jpg/1280px-Modern_apartment_building_facade.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Modern_apartment_building_facade.jpg/1280px-Modern_apartment_building_facade.jpg"
    ]
  },
  {
    id: 9,
    title: "Casa en Villa Allende",
    type: "sale" as const,
    location: "Villa Allende, Ciudad de Córdoba, Córdoba",
    price: 280000,
    coords: [-64.2950, -31.2950] as [number, number],
    bedrooms: 4,
    bathrooms: 3,
    area: "280 M²",
    furnished: false,
    parking: "Si",
    amenities: ["Jardín", "Pileta", "Quincho"],
    whatsapp: "+5493512345686",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Modern_villa_with_garden.jpg/1280px-Modern_villa_with_garden.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Modern_villa_with_garden.jpg/1280px-Modern_villa_with_garden.jpg"
    ]
  },
  {
    id: 10,
    title: "Monoambiente en Nueva Córdoba",
    type: "rent" as const,
    location: "Nueva Córdoba, Ciudad de Córdoba, Córdoba",
    price: 55000,
    coords: [-64.1880, -31.4230] as [number, number],
    bedrooms: 1,
    bathrooms: 1,
    area: "35 M²",
    furnished: true,
    parking: "No",
    amenities: ["Cocina integrada", "Aire acondicionado"],
    whatsapp: "+5493512345687",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Studio_apartment_interior.jpg/1280px-Studio_apartment_interior.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Studio_apartment_interior.jpg/1280px-Studio_apartment_interior.jpg"
    ]
  }
];

const ITEMS_PER_PAGE = 8;

const MapPage = () => {
  const location = useLocation();
  const [showMap, setShowMap] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(location.state?.location || "");
  const [propertyType, setPropertyType] = useState(location.state?.propertyType || "");
  const [budget, setBudget] = useState(location.state?.budget || "");
  const [listingType, setListingType] = useState(location.state?.listingType || "all");
  const [selectedProperty, setSelectedProperty] = useState<typeof cordobaProperties[0] | null>(null);
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [showLocations, setShowLocations] = useState(false);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  const filteredProperties = cordobaProperties.filter(property => {
    let matches = true;
    
    if (listingType !== "all") {
      matches = matches && property.type === listingType;
    }
    
    if (selectedLocation && selectedLocation !== "Sin filtrar") {
      matches = matches && property.location.toLowerCase().includes(selectedLocation.toLowerCase());
    }
    
    if (propertyType && propertyType !== "all") {
      const propertyTypeMap = {
        flat: "Apartamento",
        house: "Casa",
        loft: "Loft"
      };
      matches = matches && property.title.includes(propertyTypeMap[propertyType as keyof typeof propertyTypeMap]);
    }
    
    if (budget && budget !== "all") {
      const [min, max] = budget.split("-").map(Number);
      if (max) {
        matches = matches && property.price >= min && property.price <= max;
      } else {
        matches = matches && property.price >= min;
      }
    }
    
    return matches;
  });

  const handlePropertySelect = (property: typeof cordobaProperties[0]) => {
    setSelectedProperty(property);
  };

  const handleImageLoad = (imageUrl: string) => {
    setLoadedImages(prev => [...prev, imageUrl]);
  };

  const handleContactWhatsApp = (whatsappNumber: string) => {
    const message = encodeURIComponent(`Hola, me interesa la propiedad en ${selectedProperty?.location}`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const handleLocationSelect = (loc: string) => {
    setSelectedLocation(loc);
    setShowLocations(false);
  };

  const loadMore = () => {
    setVisibleItems(prev => Math.min(prev + ITEMS_PER_PAGE, filteredProperties.length));
  };

  const displayProperties = filteredProperties.slice(0, visibleItems);

  return (
    <div className="min-h-screen bg-black">
      <nav className="border-b border-white/10">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold">
            Terracarta
          </Link>
          <div className="flex gap-4">
            <Link to="/map">
              <Button variant="ghost" className="text-white">
                Mapa
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <div className="flex flex-col gap-4 mb-6">
          <PropertyFilters 
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            propertyType={propertyType}
            setPropertyType={setPropertyType}
            budget={budget}
            setBudget={setBudget}
            listingType={listingType}
            setListingType={setListingType}
            showLocations={showLocations}
            setShowLocations={setShowLocations}
            handleLocationSelect={handleLocationSelect}
          />

          <div className="flex items-center gap-2 justify-end">
            <span className="text-sm text-white">Mostrar mapa</span>
            <Switch
              checked={showMap}
              onCheckedChange={setShowMap}
            />
          </div>
        </div>

        <div className={`grid ${showMap ? 'md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} gap-6`}>
          {showMap && (
            <div className="relative md:order-2 md:h-[calc(100vh-200px)] h-[50vh] md:sticky md:top-24 bg-black z-10">
              <MapComponent 
                properties={filteredProperties}
                onPropertySelect={handlePropertySelect}
              />
            </div>
          )}

          <div className={`space-y-6 ${!showMap ? 'col-span-full' : 'md:order-1'} relative z-0`}>
            <div className={`grid ${showMap ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} gap-6`}>
              {displayProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={handlePropertySelect}
                />
              ))}
            </div>
            {visibleItems < filteredProperties.length && (
              <div className="flex justify-center mt-8">
                <Button 
                  onClick={loadMore}
                  className="bg-[#7FFFD4] hover:bg-[#7FFFD4]/90 text-black"
                >
                  Cargar más
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedProperty && (
        <PropertyDetails
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          loadedImages={loadedImages}
          onImageLoad={handleImageLoad}
          onWhatsAppClick={handleContactWhatsApp}
        />
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
