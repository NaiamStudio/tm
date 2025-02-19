
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
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/verify`,
            data: {
              email_confirm: true
            }
          }
        });

        if (signUpError) throw signUpError;

        if (data?.user) {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .update({ useremail: email })
            .eq('id', data.user.id);

          if (profileError) throw profileError;

          toast({
            title: "Cuenta creada",
            description: "Por favor, revisa tu correo. Se ha enviado un nuevo mensaje de confirmación.",
          });
        }
      } else if (mode === "magic-link") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/verify`
          }
        });

        if (error) throw error;

        toast({
          title: "Link mágico enviado",
          description: "Por favor, revisa tu email para iniciar sesión.",
        });
      } else if (mode === "recovery") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`
        });

        if (resetError) throw resetError;

        toast({
          title: "Recuperación iniciada",
          description: "Por favor, revisa tu email para restablecer tu contraseña.",
        });
      } else {
        // Login mode
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        navigate("/dashboard");
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
        return "Recuperar contraseña";
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
