/**
 * Constantes de rotas do sistema
 * Centraliza todos os paths para evitar erros de digitação e facilitar manutenção
 */

export const ROUTES = {
  // Rotas públicas
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",

  // Rotas base por perfil
  PATIENT: "/patient",
  PROFESSIONAL: "/professional",
  ADMIN: "/admin",

  // Rotas de paciente
  PATIENT_DASHBOARD: "/patient/dashboard",
  PATIENT_APPOINTMENTS: "/patient/appointments",
  PATIENT_HISTORY: "/patient/history",
  PATIENT_TELEMEDICINE: "/patient/telemedicine",
  PATIENT_EXAMS: "/patient/exams",

  // Rotas de profissional
  PROFESSIONAL_DASHBOARD: "/professional/dashboard",
  PROFESSIONAL_SCHEDULE: "/professional/schedule",
  PROFESSIONAL_RECORDS: "/professional/records",
  PROFESSIONAL_PRESCRIPTIONS: "/professional/prescriptions",
  PROFESSIONAL_EXAMS: "/professional/exams",

  // Rotas de admin
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  ADMIN_BEDS: "/admin/beds",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_FINANCIAL: "/admin/financial",
} as const;

/**
 * Helper para construir paths relativos dentro de um módulo
 */
export const buildRoute = {
  patient: (subPath: string) =>
    `${ROUTES.PATIENT}${subPath.startsWith("/") ? subPath : `/${subPath}`}`,
  professional: (subPath: string) =>
    `${ROUTES.PROFESSIONAL}${
      subPath.startsWith("/") ? subPath : `/${subPath}`
    }`,
  admin: (subPath: string) =>
    `${ROUTES.ADMIN}${subPath.startsWith("/") ? subPath : `/${subPath}`}`,
};

/**
 * Mapeamento de dashboards por role (usado em redirecionamentos)
 */
export const DASHBOARD_ROUTES = {
  patient: ROUTES.PATIENT_DASHBOARD,
  professional: ROUTES.PROFESSIONAL_DASHBOARD,
  admin: ROUTES.ADMIN_DASHBOARD,
} as const;
