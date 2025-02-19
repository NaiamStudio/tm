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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error("Error de autenticación:", authError);
          navigate("/auth");
          return;
        }

        if (!user) {
          console.log("No hay usuario autenticado");
          navigate("/auth");
          return;
        }

        await fetchUserProfile(user.id);
      } catch (error) {
        console.error("Error en checkAuth:", error);
        navigate("/auth");
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchUserProfile = async (userId: string) => {
    try {
      setIsLoading(true);

      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error al obtener perfil:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar la información del usuario",
          variant: "destructive",
        });
        return;
      }

      if (!profile) {
        console.error("No se encontró el perfil del usuario");
        toast({
          title: "Error",
          description: "No se encontró el perfil del usuario",
          variant: "destructive",
        });
        return;
      }

      // Actualizar estado con los datos del perfil
      setUsername(profile.username || "");
      setEmail(profile.useremail || "");
      setIsAdmin(profile.is_admin || false);
      setIsPublisher(profile.is_prop_publisher || false);

      // Verificar elegibilidad para cambio de username
      await checkUsernameChangeEligibility(userId);

    } catch (error) {
      console.error("Error al procesar perfil:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al cargar los datos del usuario",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkUsernameChangeEligibility = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('can_change_username', {
        user_id: userId
      });

      if (error) {
        console.error("Error al verificar elegibilidad de cambio de username:", error);
        return;
      }

      setCanChangeUsername(data);
    } catch (error) {
      console.error("Error en checkUsernameChangeEligibility:", error);
    }
  };

  const handleUsernameChange = async () => {
    try {
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

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "No se pudo verificar la autenticación",
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
        .eq("id", user.id);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "¡Éxito!",
        description: "Username actualizado correctamente",
      });

      setUsername(newUsername);
      setNewUsername("");
      setIsEditingUsername(false);
      setCanChangeUsername(false);
    } catch (error) {
      console.error("Error al cambiar username:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el username",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error al cerrar sesión:", error);
        toast({
          title: "Error",
          description: "No se pudo cerrar la sesión",
          variant: "destructive",
        });
        return;
      }
      navigate("/auth");
    } catch (error) {
      console.error("Error en handleLogout:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al cerrar sesión",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Cargando...</h2>
          <p className="text-gray-400">Por favor espera mientras cargamos tus datos</p>
        </div>
      </div>
    );
  }

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
