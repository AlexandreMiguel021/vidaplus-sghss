import { NavLink } from "react-router-dom";
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
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/app/routes";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: ROUTES.PATIENT_DASHBOARD,
    icon: LayoutDashboard,
    roles: ["patient"],
  },
  {
    label: "Agendar Consulta",
    href: ROUTES.PATIENT_APPOINTMENTS,
    icon: Calendar,
    roles: ["patient"],
  },
  {
    label: "Histórico Clínico",
    href: ROUTES.PATIENT_HISTORY,
    icon: FileText,
    roles: ["patient"],
  },
  {
    label: "Telemedicina",
    href: ROUTES.PATIENT_TELEMEDICINE,
    icon: Video,
    roles: ["patient"],
  },
  {
    label: "Meus Exames",
    href: ROUTES.PATIENT_EXAMS,
    icon: TestTube,
    roles: ["patient"],
  },
  {
    label: "Dashboard",
    href: ROUTES.PROFESSIONAL_DASHBOARD,
    icon: LayoutDashboard,
    roles: ["professional"],
  },
  {
    label: "Minha Agenda",
    href: ROUTES.PROFESSIONAL_SCHEDULE,
    icon: Calendar,
    roles: ["professional"],
  },
  {
    label: "Prontuários",
    href: ROUTES.PROFESSIONAL_RECORDS,
    icon: ClipboardList,
    roles: ["professional"],
  },
  {
    label: "Emitir Receita",
    href: ROUTES.PROFESSIONAL_PRESCRIPTIONS,
    icon: Stethoscope,
    roles: ["professional"],
  },
  {
    label: "Gestão de Exames",
    href: ROUTES.PROFESSIONAL_EXAMS,
    icon: TestTube,
    roles: ["professional"],
  },
  {
    label: "Dashboard",
    href: ROUTES.ADMIN_DASHBOARD,
    icon: LayoutDashboard,
    roles: ["admin"],
  },
  {
    label: "Gestão de Usuários",
    href: ROUTES.ADMIN_USERS,
    icon: Users,
    roles: ["admin"],
  },
  {
    label: "Controle de Leitos",
    href: ROUTES.ADMIN_BEDS,
    icon: Bed,
    roles: ["admin"],
  },
  {
    label: "Relatórios",
    href: ROUTES.ADMIN_REPORTS,
    icon: BarChart3,
    roles: ["admin"],
  },
  {
    label: "Financeiro",
    href: ROUTES.ADMIN_FINANCIAL,
    icon: DollarSign,
    roles: ["admin"],
  },
];

export function Sidebar() {
  const { user } = useAuth();

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role || "")
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
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  "text-granite-700 hover:bg-jungle-teal-50 hover:text-jungle-teal-700",
                  isActive &&
                    "bg-jungle-teal-100 text-jungle-teal-700 font-medium"
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
