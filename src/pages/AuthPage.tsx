
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
  const [mode, setMode] = useState<"login" | "signup" | "magic-link" | "recovery">("login");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signup") {
        // Verificamos si el usuario existe usando signInWithOtp
        const { error: checkError } = await supabase.auth.signInWithOtp({
          email,
        });

        // Si no hay error, significa que el usuario existe
        if (!checkError) {
          throw new Error("Este email ya está registrado. Si no has confirmado tu cuenta, revisa tu email o solicita un nuevo link de confirmación.");
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: 'https://tm.lovable.app/verify'
          }
        });

        if (signUpError) throw signUpError;

        if (data?.user) {
          toast({
            title: "Registro iniciado",
            description: "Por favor, verifica tu email para completar el registro. Revisa también tu carpeta de spam.",
          });
        }
      } else if (mode === "magic-link") {
        const { data, error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: 'https://tm.lovable.app/verify'
          }
        });

        if (error) {
          if (error.message.includes("Email not confirmed")) {
            throw new Error("Este email no está confirmado. Por favor, confirma tu cuenta primero.");
          }
          throw error;
        }

        toast({
          title: "Link mágico enviado",
          description: "Por favor, revisa tu email para iniciar sesión.",
        });
      } else if (mode === "recovery") {
        // Para recuperación, intentamos primero verificar si el usuario existe
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: "dummy-password",
        });

        // Si no hay error de usuario no encontrado, procedemos con la recuperación
        if (error && error.message.includes("Invalid login credentials")) {
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://tm.lovable.app/verify'
          });

          if (resetError) throw resetError;

          toast({
            title: "Recuperación iniciada",
            description: "Por favor, revisa tu email para restablecer tu contraseña.",
          });
        } else if (error) {
          throw new Error("Este email no está registrado o no ha sido confirmado.");
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

  const getTitle = () => {
    switch (mode) {
      case "signup":
        return "Crear cuenta";
      case "magic-link":
        return "Iniciar con link mágico";
      case "recovery":
        return "Recuperar cuenta";
      default:
        return "Iniciar sesión";
    }
  };

  const getDescription = () => {
    switch (mode) {
      case "signup":
        return "Ingresa tus datos para crear una cuenta";
      case "magic-link":
        return "Recibirás un link por email para iniciar sesión";
      case "recovery":
        return "Te enviaremos instrucciones por email";
      default:
        return "Ingresa tus credenciales para acceder";
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white/5 p-8 rounded-lg shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">
            {getTitle()}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {getDescription()}
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
          {mode !== "magic-link" && mode !== "recovery" && (
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
          )}
          <Button
            type="submit"
            className="w-full bg-[#7FFFD4] text-black hover:bg-[#7FFFD4]/90 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Procesando..." : getTitle()}
          </Button>
        </form>
        <div className="space-y-2 text-center">
          {mode === "login" && (
            <>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-[#7FFFD4] hover:underline text-sm block w-full"
              >
                ¿No tienes cuenta? Regístrate
              </button>
              <button
                type="button"
                onClick={() => setMode("magic-link")}
                className="text-[#7FFFD4] hover:underline text-sm block w-full"
              >
                Iniciar con link mágico
              </button>
              <button
                type="button"
                onClick={() => setMode("recovery")}
                className="text-[#7FFFD4] hover:underline text-sm block w-full"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </>
          )}
          {mode !== "login" && (
            <button
              type="button"
              onClick={() => setMode("login")}
              className="text-[#7FFFD4] hover:underline text-sm block w-full"
            >
              Volver al inicio de sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
