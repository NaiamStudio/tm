
import { Button } from "@/components/ui/button";
import { X, ExternalLink } from "lucide-react";

interface Property {
  title: string;
  location: string;
  price: number;
  type: 'rent' | 'sale';
  bedrooms: number;
  bathrooms: number;
  area: string;
  furnished: boolean;
  parking: string;
  amenities: string[];
  whatsapp: string;
  gallery: string[];
}

interface PropertyDetailsProps {
  property: Property;
  onClose: () => void;
  loadedImages: string[];
  onImageLoad: (imageUrl: string) => void;
  onWhatsAppClick: (whatsappNumber: string) => void;
}

export const PropertyDetails = ({
  property,
  onClose,
  loadedImages,
  onImageLoad,
  onWhatsAppClick,
}: PropertyDetailsProps) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start p-4 border-b">
          <div>
            <h1 className="text-2xl font-bold">{property.title}</h1>
            <p className="text-gray-600">{property.location}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-3 gap-4">
              {property.gallery.map((imageUrl, index) => (
                <div 
                  key={index}
                  className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => !loadedImages.includes(imageUrl) && onImageLoad(imageUrl)}
                >
                  {loadedImages.includes(imageUrl) ? (
                    <img
                      src={imageUrl}
                      alt={`${property.title} - Imagen ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-100">
                      <ExternalLink className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Características</h3>
                <ul className="space-y-2">
                  <li>Habitaciones: {property.bedrooms}</li>
                  <li>Baños: {property.bathrooms}</li>
                  <li>Área: {property.area}</li>
                  <li>Amoblado: {property.furnished ? 'Si' : 'No'}</li>
                  <li>Estacionamiento: {property.parking}</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Amenities</h3>
                <ul className="space-y-2">
                  {property.amenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold text-primary">
                ${property.price.toLocaleString()}
                {property.type === 'rent' && <span className="text-sm text-gray-500 ml-1">/mes</span>}
              </div>
              <Button 
                className="bg-[#25D366] hover:bg-[#25D366]/90 text-white"
                onClick={() => onWhatsAppClick(property.whatsapp)}
              >
                Contactar por WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
