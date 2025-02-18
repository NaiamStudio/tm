
interface Property {
  id: number;
  title: string;
  type: 'rent' | 'sale';
  location: string;
  price: number;
  image: string;
}

interface PropertyCardProps {
  property: Property;
  onClick: (property: Property) => void;
}

export const PropertyCard = ({ property, onClick }: PropertyCardProps) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick(property)}
    >
      <div className="relative h-48">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${
          property.type === 'rent' ? 'bg-[#7FFFD4]/20' : 'bg-[#FEF7CD]/20'
        }`} />
      </div>
      <div className="p-4">
        <div className="inline-block px-2 py-1 rounded text-xs font-medium bg-[#7FFFD4]/10 text-[#7FFFD4] mb-2">
          {property.type === 'rent' ? 'ALQUILER' : 'VENTA'}
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {property.title}
        </h3>
        <p className="text-gray-600 mb-4">{property.location}</p>
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-[#7FFFD4]">
            ${property.price.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            {property.type === 'rent' ? '/mes' : ''}
          </div>
        </div>
      </div>
    </div>
  );
};
