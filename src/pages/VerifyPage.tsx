
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const handleVerification = async () => {
      try {
        // Obtenemos el token y tipo de la URL
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        const next = searchParams.get('next');

        if (!token_hash || !type) {
          throw new Error("Enlaces de verificación inválidos");
        }

        // Verificamos el token según el tipo
        if (type === 'email') {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'email',
          });

          if (error) throw error;

          toast({
            title: "Email verificado",
            description: "Tu cuenta ha sido verificada exitosamente. Ya puedes iniciar sesión.",
          });
        } else if (type === 'recovery') {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'recovery',
          });

          if (error) throw error;

          toast({
            title: "Contraseña restablecida",
            description: "Tu contraseña ha sido actualizada exitosamente.",
          });
        } else if (type === 'magiclink') {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'magiclink',
          });

          if (error) throw error;

          toast({
            title: "Sesión iniciada",
            description: "Has iniciado sesión exitosamente.",
          });
        }

        // Redirigimos al usuario
        if (next) {
          window.location.href = next;
        } else {
          navigate('/explore');
        }
      } catch (error: any) {
        console.error('Error de verificación:', error);
        toast({
          title: "Error de verificación",
          description: error.message || "Ha ocurrido un error durante la verificación",
          variant: "destructive",
        });
        navigate('/auth');
      } finally {
        setVerifying(false);
      }
    };

    handleVerification();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white/5 p-8 rounded-lg shadow-xl text-center">
        <h2 className="text-3xl font-bold text-white">
          {verifying ? "Verificando..." : "Verificación completa"}
        </h2>
        <p className="text-sm text-gray-400">
          {verifying 
            ? "Por favor, espera mientras verificamos tu cuenta..." 
            : "Serás redirigido automáticamente..."}
        </p>
      </div>
    </div>
  );
};

export default VerifyPage;
