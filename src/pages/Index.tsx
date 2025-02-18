
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, MapPin, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const locations = [
  "Sin filtrar",
  "Nueva Córdoba, Ciudad de Córdoba, Córdoba",
  "Centro, Ciudad de Córdoba, Córdoba",
  "Alberdi, Ciudad de Córdoba, Córdoba",
  "Güemes, Ciudad de Córdoba, Córdoba",
  "General Paz, Ciudad de Córdoba, Córdoba",
  "Alta Córdoba, Ciudad de Córdoba, Córdoba",
  "Villa Allende, Córdoba",
  "Mendiolaza, Córdoba",
  "Saldán, Córdoba"
];

const HomePage = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [showLocations, setShowLocations] = useState(false);
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const [listingType, setListingType] = useState("all");

  const handleSearch = () => {
    navigate("/map", {
      state: { 
        location, 
        propertyType, 
        budget, 
        listingType 
      },
    });
  };

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setShowLocations(false);
  };

  const handleLocationInputFocus = () => {
    setShowLocations(true);
  };

  const handleClickOutside = () => {
    setShowLocations(false);
  };

  return (
    <div className="min-h-screen bg-black">
      <nav className="container mx-auto p-4 flex justify-between items-center">
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
      </nav>

      <main className="container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">
            Terracarta
          </h1>
          <p className="text-white/90 text-lg md:text-xl">
            El mapa de propiedades en venta y alquiler
          </p>
        </div>

        <div className="bg-white rounded-xl p-2 shadow-lg max-w-4xl mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Ubicación"
                className="pl-10"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={handleLocationInputFocus}
              />
              {showLocations && (
                <div 
                  className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-1 z-10"
                  onMouseLeave={handleClickOutside}
                >
                  {locations
                    .filter(loc => 
                      loc.toLowerCase().includes(location.toLowerCase())
                    )
                    .map((loc, index) => (
                      <div 
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleLocationSelect(loc)}
                      >
                        {loc}
                      </div>
                    ))
                  }
                </div>
              )}
            </div>

            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Select
                value={propertyType}
                onValueChange={setPropertyType}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Tipo de propiedad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Sin filtrar</SelectItem>
                  <SelectItem value="flat">Departamento</SelectItem>
                  <SelectItem value="house">Casa</SelectItem>
                  <SelectItem value="loft">Loft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger>
                  <SelectValue placeholder="Rango de precio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Sin filtrar</SelectItem>
                  <SelectItem value="0-50000">$0 - $50.000</SelectItem>
                  <SelectItem value="50000-100000">$50.000 - $100.000</SelectItem>
                  <SelectItem value="100000+">$100.000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={listingType} onValueChange={setListingType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de operación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Sin filtrar</SelectItem>
                  <SelectItem value="rent">Alquiler</SelectItem>
                  <SelectItem value="sale">Venta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="bg-[#7FFFD4] hover:bg-[#7FFFD4]/90 text-black"
              onClick={handleSearch}
            >
              <Search className="mr-2 h-4 w-4" /> Buscar
            </Button>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 w-full bg-black border-t border-white/10 py-4">
        <p className="text-center text-white">
          2025 Terracarta - Desarrollado por{" "}
          <a
            href="https://naiam.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7FFFD4] hover:text-[#7FFFD4]/80"
          >
            naiam
          </a>
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
