
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPublisher, setIsPublisher] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [canChangeUsername, setCanChangeUsername] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Checking auth, user:", user);
      if (!user) {
        console.log("No user found, redirecting to /auth");
        navigate("/auth");
        return;
      }
      checkUser();
    };

    checkAuth();
  }, [navigate]);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("No user found in checkUser");
        navigate("/auth");
        return;
      }

      console.log("Fetching user profile for:", user.id);
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("username, useremail, is_admin, is_prop_publisher")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar la información del usuario",
          variant: "destructive",
        });
        return;
      }

      if (profile) {
        console.log("Profile found:", profile);
        setUsername(profile.username);
        setEmail(profile.useremail || user.email || "");
        setIsAdmin(profile.is_admin || false);
        setIsPublisher(profile.is_prop_publisher || false);
        checkUsernameChangeEligibility(user.id);
      } else {
        console.log("No profile found for user:", user.id);
        toast({
          title: "Error",
          description: "No se encontró el perfil del usuario",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in checkUser:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del usuario",
        variant: "destructive",
      });
    }
  };

  const checkUsernameChangeEligibility = async (userId: string) => {
    const { data, error } = await supabase.rpc('can_change_username', {
      user_id: userId
    });

    if (error) {
      console.error("Error checking username change eligibility:", error);
      return;
    }

    setCanChangeUsername(data);
  };

  const handleUsernameChange = async () => {
    if (!newUsername || newUsername.length < 5 || newUsername.length > 12) {
      toast({
        title: "Error",
        description: "El username debe tener entre 5 y 12 caracteres",
        variant: "destructive",
      });
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9._]*[a-zA-Z0-9]$/;
    if (!usernameRegex.test(newUsername)) {
      toast({
        title: "Error",
        description: "El username solo puede contener letras, números, puntos y guiones bajos",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("user_profiles")
      .update({ 
        username: newUsername,
        last_username_change: new Date().toISOString()
      })
      .eq("username", username);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Username actualizado",
      description: "Tu username ha sido actualizado correctamente",
    });

    setUsername(newUsername);
    setNewUsername("");
    setIsEditingUsername(false);
    setCanChangeUsername(false);
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
        <div className="mb-12">
          <div className="max-w-2xl mx-auto bg-white/5 p-6 rounded-lg">
            <h1 className="text-4xl font-bold mb-4 text-center">
              ¡Bienvenido, {username}!
            </h1>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Email:</p>
                <p className="text-white">{email}</p>
              </div>
              <div>
                <p className="text-gray-400">Username:</p>
                {isEditingUsername ? (
                  <div className="flex gap-2">
                    <Input
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Nuevo username"
                      className="bg-white/10 border-white/20 text-white"
                    />
                    <Button 
                      onClick={handleUsernameChange}
                      disabled={!canChangeUsername}
                    >
                      Guardar
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsEditingUsername(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <p className="text-white">{username}</p>
                    {canChangeUsername && (
                      <Button 
                        variant="ghost" 
                        onClick={() => setIsEditingUsername(true)}
                      >
                        Editar
                      </Button>
                    )}
                  </div>
                )}
                {!canChangeUsername && (
                  <p className="text-sm text-gray-500">
                    Podrás cambiar tu username nuevamente en 9 días desde el último cambio
                  </p>
                )}
              </div>
            </div>
          </div>
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
