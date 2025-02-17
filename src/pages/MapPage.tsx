
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MapComponent } from "@/components/MapComponent";
import { Button } from "@/components/ui/button";
import { Search, Heart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const cordobaProperties = [
  {
    id: 1,
    title: "Luxury Apartment in Nueva Córdoba",
    type: "FLAT",
    location: "Nueva Córdoba",
    price: 80000,
    coords: [-64.1888, -31.4201] as [number, number], // Correct format: [longitude, latitude]
    bedrooms: 3,
    bathrooms: 2,
    area: "120 M²",
  },
  {
    id: 2,
    title: "Modern Loft in Güemes",
    type: "LOFT",
    location: "Güemes",
    price: 65000,
    coords: [-64.1900, -31.4250] as [number, number], // Correct format: [longitude, latitude]
    bedrooms: 1,
    bathrooms: 1,
    area: "80 M²",
  },
  // Add more properties as needed
];

const MapPage = () => {
  const location = useLocation();
  const [showMap, setShowMap] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("Córdoba");
  const [priceRange, setPriceRange] = useState("");
  const [accommodationType, setAccommodationType] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <div className="text-primary text-2xl font-bold">Flate</div>
          <div className="flex gap-4">
            <Button variant="outline">Search</Button>
            <Button className="bg-primary hover:bg-primary/90">List</Button>
            <Button variant="ghost">EN</Button>
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
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Córdoba">Córdoba</SelectItem>
                <SelectItem value="Nueva Córdoba">Nueva Córdoba</SelectItem>
                <SelectItem value="Güemes">Güemes</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-50000">$0 - $50,000</SelectItem>
                <SelectItem value="50000-100000">
                  $50,000 - $100,000
                </SelectItem>
                <SelectItem value="100000+">$100,000+</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={accommodationType}
              onValueChange={setAccommodationType}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Accommodations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flat">Flat</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="loft">Loft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show map</span>
            <Switch
              checked={showMap}
              onCheckedChange={setShowMap}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {cordobaProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative h-48 bg-primary">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-white hover:text-primary hover:bg-white"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
                <div className="p-4">
                  <div className="inline-block px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary mb-2">
                    {property.type}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{property.location}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-primary">
                      ${property.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">/month</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showMap && (
            <div className="h-[calc(100vh-200px)] sticky top-24">
              <MapComponent properties={cordobaProperties} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPage;
