
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

const HomePage = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");

  const handleSearch = () => {
    navigate("/map", {
      state: { location, propertyType, budget },
    });
  };

  return (
    <div className="min-h-screen bg-primary overflow-hidden">
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          Terracarta
        </Link>
        <div className="flex gap-4">
          <Button variant="ghost" className="text-white">
            Buscar
          </Button>
          <Button variant="ghost" className="text-white">
            Publicar
            <span className="ml-2 bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs">
              1
            </span>
          </Button>
          <Button variant="ghost" className="text-white">
            ES
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-white text-6xl font-bold mb-4 leading-tight">
            ¿Cómo es tu próximo hogar?
          </h1>
          <p className="text-white/90 text-xl">
            Disfruta de una nueva experiencia de alquiler
          </p>
        </div>

        <div className="bg-white rounded-xl p-2 shadow-lg max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Ubicación"
                className="pl-10"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              {location && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-1 z-10">
                  <div className="p-2 hover:bg-gray-100 cursor-pointer">
                    Nueva Córdoba
                  </div>
                  <div className="p-2 hover:bg-gray-100 cursor-pointer">
                    Centro
                  </div>
                  <div className="p-2 hover:bg-gray-100 cursor-pointer">
                    Alberdi
                  </div>
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
                  <SelectItem value="0-50000">$0 - $50.000</SelectItem>
                  <SelectItem value="50000-100000">
                    $50.000 - $100.000
                  </SelectItem>
                  <SelectItem value="100000+">$100.000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={handleSearch}
            >
              <Search className="mr-2 h-4 w-4" /> Buscar
            </Button>
          </div>
        </div>
      </main>

      <div className="absolute right-0 bottom-0 w-1/2 h-1/2">
        <div className="animate-float">
          <img
            src="/lovable-uploads/c5b7e23d-56b6-4249-8831-63886e4f38be.png"
            alt="Ilustración decorativa"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
