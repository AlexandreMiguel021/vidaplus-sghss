import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Video,
  Users,
  Bed,
  BarChart3,
  Stethoscope,
  ClipboardList,
  TestTube,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/patient/dashboard',
    icon: LayoutDashboard,
    roles: ['patient'],
  },
  {
    label: 'Agendar Consulta',
    href: '/patient/appointments',
    icon: Calendar,
    roles: ['patient'],
  },
  {
    label: 'Histórico Clínico',
    href: '/patient/history',
    icon: FileText,
    roles: ['patient'],
  },
  {
    label: 'Telemedicina',
    href: '/patient/telemedicine',
    icon: Video,
    roles: ['patient'],
  },
  {
    label: 'Meus Exames',
    href: '/patient/exams',
    icon: TestTube,
    roles: ['patient'],
  },
  {
    label: 'Dashboard',
    href: '/professional/dashboard',
    icon: LayoutDashboard,
    roles: ['professional'],
  },
  {
    label: 'Minha Agenda',
    href: '/professional/schedule',
    icon: Calendar,
    roles: ['professional'],
  },
  {
    label: 'Prontuários',
    href: '/professional/records',
    icon: ClipboardList,
    roles: ['professional'],
  },
  {
    label: 'Emitir Receita',
    href: '/professional/prescriptions',
    icon: Stethoscope,
    roles: ['professional'],
  },
  {
    label: 'Gestão de Exames',
    href: '/professional/exams',
    icon: TestTube,
    roles: ['professional'],
  },
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    roles: ['admin'],
  },
  {
    label: 'Gestão de Usuários',
    href: '/admin/users',
    icon: Users,
    roles: ['admin'],
  },
  {
    label: 'Controle de Leitos',
    href: '/admin/beds',
    icon: Bed,
    roles: ['admin'],
  },
  {
    label: 'Relatórios',
    href: '/admin/reports',
    icon: BarChart3,
    roles: ['admin'],
  },
  {
    label: 'Financeiro',
    href: '/admin/financial',
    icon: DollarSign,
    roles: ['admin'],
  },
];

export function Sidebar() {
  const { user } = useAuth();

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role || '')
  );

  return (
    <aside className="w-64 bg-white border-r border-granite-200 h-[calc(100vh-4rem)] sticky top-16">
      <nav className="p-4 space-y-2">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  'text-granite-700 hover:bg-jungle-teal-50 hover:text-jungle-teal-700',
                  isActive && 'bg-jungle-teal-100 text-jungle-teal-700 font-medium'
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
