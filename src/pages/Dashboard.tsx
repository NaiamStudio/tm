
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, MapPin, LogOut } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPublisher, setIsPublisher] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("username, is_admin, is_prop_publisher")
      .eq("id", user.id)
      .single();

    if (profile) {
      setUsername(profile.username || user.email || "Usuario");
      setIsAdmin(profile.is_admin || false);
      setIsPublisher(profile.is_prop_publisher || false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  // Ejemplo de noticias para el carrusel
  const news = [
    {
      id: 1,
      title: "Nueva función de búsqueda",
      description: "Ahora puedes buscar propiedades por ubicación específica.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    },
    {
      id: 2,
      title: "Mejoras en el mapa",
      description: "Hemos actualizado la visualización de propiedades en el mapa.",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    },
    {
      id: 3,
      title: "Nuevo sistema de filtros",
      description: "Filtra propiedades por precio, tamaño y más características.",
      image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-2xl font-bold">
                Terramapa
              </Link>
              <div className="hidden md:flex space-x-4">
                <Link to="/explore">
                  <Button variant="ghost" className="text-white">
                    <MapPin className="mr-2 h-4 w-4" />
                    Explorar
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/dashboard/zadmin">
                    <Button variant="ghost" className="text-white">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Admin
                    </Button>
                  </Link>
                )}
                {isPublisher && (
                  <Link to="/dashboard/publisher">
                    <Button variant="ghost" className="text-white">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Publisher
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <Button onClick={handleLogout} variant="ghost" className="text-white">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            ¡Bienvenido, {username}!
          </h1>
          <p className="text-gray-400">
            Este es tu panel de control personal de Terramapa
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Últimas novedades</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {news.map((item) => (
                <CarouselItem key={item.id}>
                  <div className="p-1">
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full aspect-video object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-gray-200">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-black" />
            <CarouselNext className="text-black" />
          </Carousel>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
