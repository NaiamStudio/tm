
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current user:", user); // Debug log
      if (user) {
        console.log("Redirecting to dashboard..."); // Debug log
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error checking user:", error); // Debug log
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-bold text-white">
              Terramapa
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/explore">
                <Button variant="ghost" className="text-white">
                  Explorar
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-[#7FFFD4] text-black hover:bg-[#7FFFD4]/90">
                  Iniciar sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Encuentra tu próxima propiedad
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Explora propiedades en venta y renta en tu área de interés
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/explore">
              <Button className="bg-[#7FFFD4] text-black hover:bg-[#7FFFD4]/90 px-8 py-6 text-lg">
                Comenzar a explorar
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" className="text-white border-white/20 px-8 py-6 text-lg">
                Crear cuenta
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
