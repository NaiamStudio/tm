
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  username: string;
  is_admin: boolean;
  is_prop_publisher: boolean;
  last_login: string;
  creation_date: string;
}

const DashboardPage = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdmin();
    fetchUsers();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos de administrador",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setIsAdmin(true);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .order("creation_date", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      });
      return;
    }

    setUsers(data || []);
    setIsLoading(false);
  };

  const toggleUserRole = async (userId: string, field: "is_admin" | "is_prop_publisher", currentValue: boolean) => {
    const { error } = await supabase
      .from("user_profiles")
      .update({ [field]: !currentValue })
      .eq("id", userId);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol del usuario",
        variant: "destructive",
      });
      return;
    }

    fetchUsers();
    toast({
      title: "Éxito",
      description: "Rol de usuario actualizado",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard de Administración</h1>
          <Button onClick={handleLogout} variant="outline">
            Cerrar sesión
          </Button>
        </div>

        {isLoading ? (
          <div>Cargando usuarios...</div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Gestión de Usuarios</h2>
              <div className="grid gap-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-white/10 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-gray-400">
                        Creado: {new Date(user.creation_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        variant={user.is_admin ? "default" : "outline"}
                        onClick={() =>
                          toggleUserRole(user.id, "is_admin", user.is_admin)
                        }
                      >
                        {user.is_admin ? "Quitar Admin" : "Hacer Admin"}
                      </Button>
                      <Button
                        variant={user.is_prop_publisher ? "default" : "outline"}
                        onClick={() =>
                          toggleUserRole(
                            user.id,
                            "is_prop_publisher",
                            user.is_prop_publisher
                          )
                        }
                      >
                        {user.is_prop_publisher
                          ? "Quitar Publisher"
                          : "Hacer Publisher"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
