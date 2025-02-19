
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PublisherDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPublisher, setIsPublisher] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkPublisher();
  }, []);

  const checkPublisher = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("is_prop_publisher")
      .eq("id", user.id)
      .single();

    if (!profile?.is_prop_publisher) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos de publisher",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setIsPublisher(true);
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!isPublisher) return null;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard de Publisher</h1>
          <Button onClick={handleLogout} variant="outline">
            Cerrar sesión
          </Button>
        </div>

        {isLoading ? (
          <div>Cargando...</div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Gestión de Propiedades</h2>
              {/* Aquí irá el contenido del dashboard de publisher */}
              <p className="text-gray-400">Panel de control para publishers en desarrollo...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublisherDashboard;
