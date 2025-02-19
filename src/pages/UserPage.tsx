
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const UserPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{
    username: string;
    useremail: string;
    creation_date: string;
  } | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    checkUserAndLoadProfile();
  }, [username]);

  const checkUserAndLoadProfile = async () => {
    try {
      setIsLoading(true);
      
      // Verificar si hay un usuario autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Cargar el perfil solicitado por URL
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("username, useremail, creation_date")
        .eq("username", username)
        .single();

      if (!profile) {
        navigate("/auth");
        return;
      }

      setUserProfile(profile);

      // Verificar si es el perfil del usuario actual
      const { data: currentUserProfile } = await supabase
        .from("user_profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      setIsOwnProfile(currentUserProfile?.username === username);
      
    } catch (error) {
      console.error("Error loading profile:", error);
      navigate("/auth");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Cargando...</h2>
          <p className="text-gray-400">Por favor espera</p>
        </div>
      </div>
    );
  }

  if (!userProfile) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold">Terramapa</span>
            </div>
            {isOwnProfile && (
              <Button onClick={handleLogout} variant="ghost" className="text-white">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </Button>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white/5 p-6 rounded-lg">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">
                {isOwnProfile ? "Tu perfil" : `Perfil de ${userProfile.username}`}
              </h1>
              <p className="text-gray-400">
                Miembro desde {new Date(userProfile.creation_date).toLocaleDateString()}
              </p>
            </div>
            
            {isOwnProfile && (
              <div>
                <p className="text-gray-400">Email:</p>
                <p className="text-white">{userProfile.useremail}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserPage;
