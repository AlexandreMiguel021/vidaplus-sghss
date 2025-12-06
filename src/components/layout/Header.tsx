import { LogOut, Bell, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogoSmall } from '@/components/ui/logo';

export function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      patient: 'Paciente',
      professional: 'Profissional',
      admin: 'Administrador',
    };
    return labels[role as keyof typeof labels] || role;
  };

  return (
    <header className="bg-white border-b border-granite-200 h-16 flex items-center px-6 sticky top-0 z-10">
      <div className="flex items-center justify-between w-full">
        <div>
          <LogoSmall />
        </div>

        <div className="flex items-center gap-4">
          {/* Notificações */}
          <button className="relative p-2 hover:bg-granite-100 rounded-lg transition">
            <Bell className="h-5 w-5 text-granite-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Perfil do usuário */}
          <div className="flex items-center gap-3 border-l border-granite-200 pl-4">
            <div className="text-right">
              <p className="text-sm font-medium text-granite-900">{user?.name}</p>
              <p className="text-xs text-granite-500">{getRoleLabel(user?.role || '')}</p>
            </div>
            <div className="h-10 w-10 bg-jungle-teal-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-jungle-teal-700" />
            </div>
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-granite-600 hover:text-red-600"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
