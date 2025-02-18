
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertyFiltersProps {
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  propertyType: string;
  setPropertyType: (type: string) => void;
  budget: string;
  setBudget: (budget: string) => void;
  listingType: string;
  setListingType: (type: string) => void;
  showLocations: boolean;
  setShowLocations: (show: boolean) => void;
  handleLocationSelect: (location: string) => void;
}

const locations = [
  "Sin filtrar",
  "Nueva Córdoba, Ciudad de Córdoba, Córdoba",
  "Centro, Ciudad de Córdoba, Córdoba",
  "Alberdi, Ciudad de Córdoba, Córdoba",
  "Güemes, Ciudad de Córdoba, Córdoba",
  "General Paz, Ciudad de Córdoba, Córdoba",
  "Alta Córdoba, Ciudad de Córdoba, Córdoba"
];

export const PropertyFilters = ({
  selectedLocation,
  setSelectedLocation,
  propertyType,
  setPropertyType,
  budget,
  setBudget,
  listingType,
  setListingType,
  showLocations,
  setShowLocations,
  handleLocationSelect,
}: PropertyFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="relative">
        <Input
          placeholder="Ubicación"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          onFocus={() => setShowLocations(true)}
          className="w-full"
        />
        {showLocations && (
          <div 
            className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-1 z-10"
            onMouseLeave={() => setShowLocations(false)}
          >
            {locations
              .filter(loc => 
                loc.toLowerCase().includes(selectedLocation.toLowerCase())
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

      <Select value={propertyType} onValueChange={setPropertyType}>
        <SelectTrigger>
          <SelectValue placeholder="Tipo de propiedad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Sin filtrar</SelectItem>
          <SelectItem value="flat">Departamento</SelectItem>
          <SelectItem value="house">Casa</SelectItem>
          <SelectItem value="loft">Loft</SelectItem>
        </SelectContent>
      </Select>

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
  );
};
