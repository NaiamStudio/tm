
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

export const TermsAndConditions = () => {
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    const hasAcceptedTerms = Cookies.get("termsAccepted");
    if (!hasAcceptedTerms) {
      setShowTerms(true);
    }
  }, []);

  const handleAcceptTerms = () => {
    Cookies.set("termsAccepted", "true", { expires: 365 }); // Cookie válida por 1 año
    setShowTerms(false);
  };

  if (!showTerms) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Términos y Condiciones</h2>
          
          <div className="prose prose-sm max-w-none mb-6">
            <h3>1. Aceptación de los Términos</h3>
            <p>
              Al acceder y utilizar Terramapa, usted acepta estos términos y condiciones en su totalidad.
              Si no está de acuerdo con estos términos, por favor, no utilice este sitio.
            </p>

            <h3>2. Uso del Servicio</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
              ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
              ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>

            <h3>3. Privacidad y Protección de Datos</h3>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.
            </p>

            <h3>4. Responsabilidad</h3>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
              laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
              architecto beatae vitae dicta sunt explicabo.
            </p>

            <h3>5. Modificaciones</h3>
            <p>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
              consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleAcceptTerms}
              className="bg-[#7FFFD4] hover:bg-[#7FFFD4]/90 text-black"
            >
              Aceptar términos y condiciones
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
