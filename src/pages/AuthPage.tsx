
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`
          }
        });

        if (signUpError) throw signUpError;

        if (data?.user) {
          toast({
            title: "Registro exitoso",
            description: "Por favor, verifica tu email para completar el registro.",
          });
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (data?.user) {
          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('is_admin')
            .eq('id', data.user.id)
            .single();

          toast({
            title: "Inicio de sesión exitoso",
            description: "Bienvenido de vuelta!",
          });

          if (profileData?.is_admin) {
            navigate("/dashboard");
          } else {
            navigate("/explore");
          }
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: error.message || "Ha ocurrido un error durante la autenticación",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white/5 p-8 rounded-lg shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">
            {isSignUp ? "Crear cuenta" : "Iniciar sesión"}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {isSignUp
              ? "Ingresa tus datos para crear una cuenta"
              : "Ingresa tus credenciales para acceder"}
          </p>
        </div>
        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-gray-300">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-gray-300">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
              minLength={6}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#7FFFD4] text-black hover:bg-[#7FFFD4]/90 transition-colors"
            disabled={isLoading}
          >
            {isLoading
              ? "Procesando..."
              : isSignUp
              ? "Registrarse"
              : "Iniciar sesión"}
          </Button>
        </form>
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#7FFFD4] hover:underline text-sm"
          >
            {isSignUp
              ? "¿Ya tienes cuenta? Inicia sesión"
              : "¿No tienes cuenta? Regístrate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
